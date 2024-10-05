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
  imageId?: string;
  timestamp?: string;
  latitude?: string;
  longitude?: string;
  altitude?: string;
  heading?: string;
  fileName?: string;
  cameraTilt?: string;
  focalLength?: string;
  iso?: string;
  shutterSpeed?: string;
  aperture?: string;
  colorTemp?: string;
  imageFormat?: string;
  fileSize?: string;
  droneSpeed?: string;
  batteryLevel?: string;
  gpsAccuracy?: string;
  gimbalMode?: string;
  subjectDetection?: string;
  imageTags?: string;
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

  constructor(private http: HttpClient) {}

  submitQuery() {
    const apiUrl = 'http://localhost:8000/process-query/'; 

    this.isLoading = true;
    this.percentageResponse = null; // Reset any previous percentage response

    this.http.post<{ response: { response: string; data: ImageData[]; percentage?: string } }>(apiUrl, { query: this.userInput })
      .subscribe({
        next: (response) => {
          console.log('Response from server:', response);
          this.percentageResponse = response.response.percentage || null; // Store percentage if available

          // Parse the image data into a more structured format
          if (response.response.response) {
            const parsedData = this.parseResponseData(response.response.response);
            this.dataSource.data = parsedData; // Set table data
          } else {
            this.dataSource.data = []; // Reset table data if no response
          }
          
          // Dynamically generate columns based on the data
          if (this.dataSource.data.length > 0) {
            this.displayedColumns = Object.keys(this.dataSource.data[0]);
          } else {
            this.displayedColumns = []; // Reset columns if no data
          }

          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error occurred:', error);
          this.isLoading = false;
        }
      });
  }

  private parseResponseData(responseString: string): ImageData[] {
    const rows = responseString.split('\n').slice(2, -1); // Skip header and last empty row
    const data: ImageData[] = [];
    const expectedColumns = [
      "imageId",
      "timestamp",
      "latitude",
      "longitude",
      "altitude",
      "heading",
      "fileName",
      "cameraTilt",
      "focalLength",
      "iso",
      "shutterSpeed",
      "aperture",
      "colorTemp",
      "imageFormat",
      "fileSize",
      "droneSpeed",
      "batteryLevel",
      "gpsAccuracy",
      "gimbalMode",
      "subjectDetection",
      "imageTags"
    ];

    rows.forEach(row => {
      const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
      if (cells.length > 0) {
        // Create a new entry object
        const entry: ImageData = {};

        // Populate entry with existing values, only if they are present
        expectedColumns.forEach((column, index) => {
          if (cells[index] !== undefined) {
            entry[column as keyof ImageData] = cells[index];  // Type assertion
          }
        });

        data.push(entry);
      }
    });

    return data;
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.submitQuery();
    }
  }
}
