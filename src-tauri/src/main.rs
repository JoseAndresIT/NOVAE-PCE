use serde::{Deserialize, Serialize};
use std::{env, fs, path::Path, process::Command, thread, time::Duration};

#[derive(Debug, Serialize)]
struct SystemInfo {
    #[serde(rename = "cpuUsage")]
    cpu_usage: f64,
    #[serde(rename = "ramUsage")]
    ram_usage: f64,
    #[serde(rename = "batteryPercentage")]
    battery_percentage: Option<f64>,
    #[serde(rename = "uptimeSeconds")]
    uptime_seconds: u64,
    #[serde(rename = "diskUsage")]
    disk_usage: f64,
    #[serde(rename = "networkOnline")]
    network_online: bool,
}

#[derive(Debug, Deserialize, Serialize, Clone, Copy)]
#[serde(rename_all = "snake_case")]
enum QuickAction {
    Vscode,
    Browser,
    Spotify,
    Terminal,
    ReloadHyprland,
}

#[derive(Debug, Serialize)]
struct QuickActionResponse {
    action: QuickAction,
    started: bool,
    message: String,
}

#[derive(Debug, Serialize)]
struct AppError {
    code: String,
    message: String,
}

impl AppError {
    fn new(code: impl Into<String>, message: impl Into<String>) -> Self {
        Self {
            code: code.into(),
            message: message.into(),
        }
    }
}

#[derive(Clone, Copy)]
struct CpuSample {
    idle: u64,
    total: u64,
}

#[tauri::command]
fn get_system_info() -> Result<SystemInfo, AppError> {
    Ok(SystemInfo {
        cpu_usage: read_cpu_usage()?,
        ram_usage: read_ram_usage()?,
        battery_percentage: read_battery_percentage(),
        uptime_seconds: read_uptime_seconds()?,
        disk_usage: read_disk_usage()?,
        network_online: read_network_online(),
    })
}

#[tauri::command]
fn run_quick_action(action: QuickAction) -> Result<QuickActionResponse, AppError> {
    let (program, args): (String, Vec<String>) = match action {
        QuickAction::Vscode => ("code".to_string(), Vec::new()),
        QuickAction::Browser => browser_command(),
        QuickAction::Spotify => ("spotify".to_string(), Vec::new()),
        QuickAction::Terminal => terminal_command(),
        QuickAction::ReloadHyprland => ("hyprctl".to_string(), vec!["reload".to_string()]),
    };

    Command::new(&program)
        .args(&args)
        .spawn()
        .map_err(|error| {
            AppError::new(
                "ACTION_SPAWN_FAILED",
                format!("Unable to start {program}: {error}"),
            )
        })?;

    Ok(QuickActionResponse {
        action,
        started: true,
        message: format!("Started {}.", action_label(action)),
    })
}

fn read_cpu_usage() -> Result<f64, AppError> {
    let first = read_cpu_sample()?;
    thread::sleep(Duration::from_millis(120));
    let second = read_cpu_sample()?;

    let total_delta = second.total.saturating_sub(first.total);
    let idle_delta = second.idle.saturating_sub(first.idle);

    if total_delta == 0 {
        return Ok(0.0);
    }

    let usage = 100.0 * (total_delta.saturating_sub(idle_delta) as f64 / total_delta as f64);
    Ok(clamp_percent(usage))
}

fn read_cpu_sample() -> Result<CpuSample, AppError> {
    let stat = fs::read_to_string("/proc/stat").map_err(|error| {
        AppError::new(
            "CPU_READ_FAILED",
            format!("Unable to read /proc/stat: {error}"),
        )
    })?;

    let cpu_line = stat
        .lines()
        .find(|line| line.starts_with("cpu "))
        .ok_or_else(|| AppError::new("CPU_PARSE_FAILED", "Missing aggregate CPU line."))?;

    let values: Vec<u64> = cpu_line
        .split_whitespace()
        .skip(1)
        .filter_map(|value| value.parse::<u64>().ok())
        .collect();

    if values.len() < 4 {
        return Err(AppError::new(
            "CPU_PARSE_FAILED",
            "CPU sample did not include enough fields.",
        ));
    }

    let idle = values.get(3).copied().unwrap_or(0) + values.get(4).copied().unwrap_or(0);
    let total = values.iter().sum();

    Ok(CpuSample { idle, total })
}

fn read_ram_usage() -> Result<f64, AppError> {
    let meminfo = fs::read_to_string("/proc/meminfo").map_err(|error| {
        AppError::new(
            "RAM_READ_FAILED",
            format!("Unable to read /proc/meminfo: {error}"),
        )
    })?;

    let mut total_kb = None;
    let mut available_kb = None;

    for line in meminfo.lines() {
        if line.starts_with("MemTotal:") {
            total_kb = parse_meminfo_value(line);
        } else if line.starts_with("MemAvailable:") {
            available_kb = parse_meminfo_value(line);
        }
    }

    let total = total_kb.ok_or_else(|| AppError::new("RAM_PARSE_FAILED", "Missing MemTotal."))?;
    let available =
        available_kb.ok_or_else(|| AppError::new("RAM_PARSE_FAILED", "Missing MemAvailable."))?;

    if total == 0 {
        return Ok(0.0);
    }

    Ok(clamp_percent(
        100.0 * (1.0 - available as f64 / total as f64),
    ))
}

fn parse_meminfo_value(line: &str) -> Option<u64> {
    line.split_whitespace().nth(1)?.parse::<u64>().ok()
}

fn read_uptime_seconds() -> Result<u64, AppError> {
    let uptime = fs::read_to_string("/proc/uptime").map_err(|error| {
        AppError::new(
            "UPTIME_READ_FAILED",
            format!("Unable to read /proc/uptime: {error}"),
        )
    })?;

    let seconds = uptime
        .split_whitespace()
        .next()
        .and_then(|value| value.parse::<f64>().ok())
        .ok_or_else(|| AppError::new("UPTIME_PARSE_FAILED", "Unable to parse uptime seconds."))?;

    Ok(seconds.max(0.0) as u64)
}

fn read_disk_usage() -> Result<f64, AppError> {
    let output = Command::new("df")
        .args(["-P", "/"])
        .output()
        .map_err(|error| AppError::new("DISK_READ_FAILED", format!("Unable to run df: {error}")))?;

    if !output.status.success() {
        return Err(AppError::new(
            "DISK_READ_FAILED",
            "df did not return disk information for root volume.",
        ));
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    let data_line = stdout
        .lines()
        .nth(1)
        .ok_or_else(|| AppError::new("DISK_PARSE_FAILED", "Missing df data row."))?;

    let fields: Vec<&str> = data_line.split_whitespace().collect();
    let usage = fields
        .get(4)
        .and_then(|value| value.trim_end_matches('%').parse::<f64>().ok())
        .ok_or_else(|| AppError::new("DISK_PARSE_FAILED", "Unable to parse disk usage."))?;

    Ok(clamp_percent(usage))
}

fn read_battery_percentage() -> Option<f64> {
    let power_supply = Path::new("/sys/class/power_supply");
    let entries = fs::read_dir(power_supply).ok()?;
    let mut total = 0.0;
    let mut count = 0.0;

    for entry in entries.flatten() {
        let path = entry.path();
        let kind = fs::read_to_string(path.join("type")).unwrap_or_default();

        if kind.trim() != "Battery" {
            continue;
        }

        if let Ok(capacity) = fs::read_to_string(path.join("capacity")) {
            if let Ok(value) = capacity.trim().parse::<f64>() {
                total += clamp_percent(value);
                count += 1.0;
            }
        }
    }

    if count > 0.0 {
        Some(total / count)
    } else {
        None
    }
}

fn read_network_online() -> bool {
    let interfaces = match fs::read_dir("/sys/class/net") {
        Ok(entries) => entries,
        Err(_) => return false,
    };

    interfaces.flatten().any(|entry| {
        let name = entry.file_name().to_string_lossy().to_string();

        if name == "lo" {
            return false;
        }

        let operstate = fs::read_to_string(entry.path().join("operstate")).unwrap_or_default();
        operstate.trim() == "up"
    })
}

fn browser_command() -> (String, Vec<String>) {
    if let Ok(browser) = env::var("BROWSER") {
        if let Some(program) = clean_env_program(&browser) {
            return (program, Vec::new());
        }
    }

    (
        "xdg-open".to_string(),
        vec!["https://start.duckduckgo.com".to_string()],
    )
}

fn terminal_command() -> (String, Vec<String>) {
    if let Ok(terminal) = env::var("TERMINAL") {
        if let Some(program) = clean_env_program(&terminal) {
            return (program, Vec::new());
        }
    }

    for fallback in ["kitty", "alacritty", "foot", "wezterm"] {
        if command_exists(fallback) {
            return (fallback.to_string(), Vec::new());
        }
    }

    ("kitty".to_string(), Vec::new())
}

fn clean_env_program(value: &str) -> Option<String> {
    let trimmed = value.trim();

    if trimmed.is_empty() || trimmed.chars().any(char::is_whitespace) {
        return None;
    }

    Some(trimmed.to_string())
}

fn command_exists(command: &str) -> bool {
    env::var_os("PATH")
        .and_then(|paths| {
            env::split_paths(&paths)
                .map(|path| path.join(command))
                .find(|candidate| candidate.exists())
        })
        .is_some()
}

fn action_label(action: QuickAction) -> &'static str {
    match action {
        QuickAction::Vscode => "VSCode",
        QuickAction::Browser => "browser",
        QuickAction::Spotify => "Spotify",
        QuickAction::Terminal => "terminal",
        QuickAction::ReloadHyprland => "Hyprland reload",
    }
}

fn clamp_percent(value: f64) -> f64 {
    value.clamp(0.0, 100.0)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_system_info, run_quick_action])
        .run(tauri::generate_context!())
        .expect("error while running NOVAE Core application");
}

fn main() {
    run();
}
