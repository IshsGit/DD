import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

interface ImageData {
  image_id?: string;            // Updated to match API response
  timestamp?: string;           // Matches the API response
  latitude?: string;            // Matches the API response
  longitude?: string;           // Matches the API response
  altitude_m?: number | null;   // Updated to match API response
  heading_deg?: number | null;   // Updated to match API response
  file_name?: string;           // Updated to match API response
  camera_tilt_deg?: number | null; // Updated to match API response
  focal_length_mm?: number | null; // Updated to match API response
  iso?: number | null;          // Updated to match API response
  shutter_speed?: string;       // Matches the API response
  aperture?: string;            // Matches the API response
  color_temp_k?: number | null; // Updated to match API response
  image_format?: string;        // Matches the API response
  file_size_mb?: number | null; // Updated to match API response
  drone_speed_mps?: number | null; // Updated to match API response
  battery_level_pct?: number | null; // Updated to match API response
  gps_accuracy_m?: number | null; // Updated to match API response
  gimbal_mode?: string;         // Matches the API response
  subject_detection?: string;   // Matches the API response
  image_tags?: string;          // Matches the API response
}

@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    MatTableModule,
  ],
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.scss'],
})
export class UserInputComponent {
  userInput: string = '';
  dataSource = new MatTableDataSource<ImageData>([]); // For table data
  displayedColumns: string[] = [];  // Dynamically populated columns for the table
  percentageResponse: string | null = null;  // For single percentage response
  isLoading: boolean = false;
  directResponse: string | null = null; // For handling direct text responses

  constructor(private http: HttpClient) {}

  submitQuery() {
    const apiUrl = 'http://localhost:8000/process-query/'; 

    this.isLoading = true;
    this.percentageResponse = null; // Reset any previous percentage response
    this.directResponse = null; // Reset direct response

    this.http.post<{ response: { response: string; data: ImageData[]; percentage?: string } }>(apiUrl, { query: this.userInput })
      .subscribe({
        next: (response) => {
          console.log('Response from server:', response);
          this.percentageResponse = response.response.percentage || null; // Store percentage if available

          // Check if there's structured data or direct text response
          if (response.response.data && response.response.data.length > 0) {
            // When there is structured image data
            this.dataSource.data = response.response.data;
            this.displayedColumns = Object.keys(this.dataSource.data[0]);
            this.directResponse = null; // Clear direct response
          } else {
            // Handle direct response
            this.directResponse = this.parseDirectResponse(response.response.response);
            this.dataSource.data = []; // Clear any previous table data
            this.displayedColumns = []; // Reset columns
          }

          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error occurred:', error);
          this.isLoading = false;
        }
      });
  }

  private parseDirectResponse(responseString: string): string {
    // This function could be expanded based on your formatting needs.
    return responseString.replace(/'/g, ''); // Simple cleaning if needed, adjust as necessary.
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.submitQuery();
    }
  }
}
