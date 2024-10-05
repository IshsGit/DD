export interface DroneData {
    image_id?: string;
    timestamp?: string;
    latitude?: string;
    longitude?: string;
    altitude_m?: number;
    heading_deg?: number;
    file_name?: string;
    camera_tilt_deg?: number;
    focal_length_mm?: number;
    iso?: number;
    shutter_speed?: string;
    aperture?: string;
    color_temp_k?: number;
    image_format?: string;
    file_size_mb?: number;
    drone_speed_mps?: number;
    battery_level_pct?: number;
    gps_accuracy_m?: number;
    gimbal_mode?: string;
    subject_detection?: string;
    image_tags?: string[];
  }
  