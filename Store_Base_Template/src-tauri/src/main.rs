#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use serialport::{SerialPort, FlowControl, Parity, StopBits};
use std::time::Duration;
use std::io::{Write, Read};

#[tauri::command]
fn list_serial_ports() -> Result<Vec<String>, String> {
    match serialport::available_ports() {
        Ok(ports) => {
            let port_names = ports.into_iter().map(|p| p.port_name).collect();
            Ok(port_names)
        }
        Err(e) => Err(format!("Failed to list serial ports: {}", e)),
    }
}

#[tauri::command]
fn print_thermal_receipt(port_name: String, receipt_text: String) -> Result<String, String> {
    let mut port = serialport::new(&port_name, 9600)
        .timeout(Duration::from_millis(3000))
        .open()
        .map_err(|e| format!("Failed to open thermal printer port {}: {}", port_name, e))?;

    // ESC/POS Initialization & Print Receipt
    let init_cmd = vec![0x1B, 0x40]; // ESC @
    let cut_cmd = vec![0x1D, 0x56, 0x41, 0x10]; // GS V A (Cut paper)
    
    port.write_all(&init_cmd).map_err(|e| e.to_string())?;
    port.write_all(receipt_text.as_bytes()).map_err(|e| e.to_string())?;
    port.write_all(b"\n\n").map_err(|e| e.to_string())?;
    port.write_all(&cut_cmd).map_err(|e| e.to_string())?;

    Ok(format!("تم طباعة الإيصال بنجاح عبر منفذ السيريال {}", port_name))
}

#[tauri::command]
fn update_customer_display(port_name: String, line1: String, line2: String) -> Result<String, String> {
    let mut port = serialport::new(&port_name, 9600)
        .timeout(Duration::from_millis(2000))
        .open()
        .map_err(|e| format!("Failed to open customer display port {}: {}", port_name, e))?;

    let clear_screen = vec![0x0C]; // Form feed / clear
    port.write_all(&clear_screen).map_err(|e| e.to_string())?;
    
    let display_data = format!("{}\n{}", line1, line2);
    port.write_all(display_data.as_bytes()).map_err(|e| e.to_string())?;

    Ok("تم تحديث شاشة عرض العميل بنجاح".into())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            list_serial_ports,
            print_thermal_receipt,
            update_customer_display
        ])
        .run(tauri::generate_context!())
        .error("error while running tauri application");
}
