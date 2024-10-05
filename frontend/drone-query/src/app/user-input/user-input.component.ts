import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
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
  [key: string]: string | number | null | undefined; // Index signature to allow dynamic keys
  image_id?: string;
  timestamp?: string;
  latitude?: string;
  longitude?: string;
  altitude_m?: number | null;
  heading_deg?: number | null;
  file_name?: string;
  camera_tilt_deg?: number | null;
  focal_length_mm?: number | null;
  iso?: number | null;
  shutter_speed?: string;
  aperture?: string;
  color_temp_k?: number | null;
  image_format?: string;
  file_size_mb?: number | null;
  drone_speed_mps?: number | null;
  battery_level_pct?: number | null;
  gps_accuracy_m?: number | null;
  gimbal_mode?: string;
  subject_detection?: string;
  image_tags?: string;
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
export class UserInputComponent implements AfterViewInit {
  userInput: string = '';
  dataSource = new MatTableDataSource<ImageData>([]);
  displayedColumns: string[] = [];
  originalData: ImageData[] = []; // Store original data for reset
  percentageResponse: string | null = null;
  directResponse: string | null = null; // Added directResponse variable
  isLoading: boolean = false;

  public currentSort: { column: string | null; direction: 'asc' | 'desc' | 'original' } = { column: null, direction: 'asc' };

  @ViewChild(MatSort) sort!: MatSort; // Using non-null assertion operator

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort; // Initialize sorting here
  }

  submitQuery() {
    const apiUrl = 'http://localhost:8000/process-query/';
    this.isLoading = true;
    this.percentageResponse = null;
    this.directResponse = null; // Reset direct response

    this.http.post<{ response: { response: string; data: ImageData[]; percentage?: string } }>(apiUrl, { query: this.userInput })
      .subscribe({
        next: (response) => {
          console.log('Response from server:', response);
          
          // Handle percentage response
          this.percentageResponse = response.response.percentage || null;
          
          // Handle direct response and ensure metric stays
          this.directResponse = response.response.response || null;
          
          // Clear the table if no data is available
          if (response.response.data && response.response.data.length > 0) {
            this.dataSource.data = response.response.data;
            this.originalData = response.response.data; // Store original data for reset
            // Set displayed columns dynamically based on response data keys
            this.displayedColumns = Object.keys(response.response.data[0]);
          } else {
            this.dataSource.data = [];
            this.displayedColumns = [];
          }

          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error occurred:', error);
          this.isLoading = false;
        }
      });
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.submitQuery();
    }
  }

  // Sort the data based on the clicked column
  sortData(column: string) {
    // Determine the sort direction
    if (this.currentSort.column === column) {
      if (this.currentSort.direction === 'asc') {
        this.currentSort.direction = 'desc';
      } else if (this.currentSort.direction === 'desc') {
        this.currentSort.direction = 'original'; // Back to original
        this.dataSource.data = [...this.originalData]; // Reset to original data order
        return; // Exit early, no sorting applied
      }
    } else {
      this.currentSort.column = column;
      this.currentSort.direction = 'asc'; // Start with ascending
    }

    // Perform sorting based on direction
    this.dataSource.data.sort((a, b) => {
      const aValue = a[column] ?? ''; // Fallback to empty string if null/undefined
      const bValue = b[column] ?? ''; // Fallback to empty string if null/undefined

      if (this.currentSort.direction === 'asc') {
        return aValue > bValue ? 1 : -1; // Ascending order
      } else if (this.currentSort.direction === 'desc') {
        return aValue < bValue ? 1 : -1; // Descending order
      }
      return 0; // Original order
    });

    // Update data source to trigger view update
    this.dataSource.data = [...this.dataSource.data]; // Clone the array to trigger change detection
  }

  // Reset sorting and show original data
  resetSort() {
    this.currentSort = { column: null, direction: 'asc' }; // Reset sort state
    this.dataSource.data = [...this.originalData]; // Show original data
  }
}
