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
  dataSource = new MatTableDataSource<any>([]); // For table data
  displayedColumns: string[] = [];  // Dynamically populated columns for the table
  percentageResponse: string | null = null;  // For single percentage response
  isLoading: boolean = false;

  constructor(private http: HttpClient) {}

  submitQuery() {
    const apiUrl = 'http://localhost:8000/process-query/'; 

    this.isLoading = true;
    this.percentageResponse = null; // Reset any previous percentage response

    this.http.post<{ response: string }>(apiUrl, { query: this.userInput })
      .subscribe({
        next: (response) => {
          console.log('Response from server:', response);
          const responseData = response.response.trim();

          // Check if the response is a percentage (single data)
          if (responseData.includes('%')) {
            this.percentageResponse = responseData; // Display percentage
            this.dataSource.data = [];  // Clear table data
          } 
          // Check for structured text format
          else if (responseData.startsWith('**Image')) {
            this.percentageResponse = null; // Clear any percentage response
            this.dataSource.data = this.parseStructuredTextResponse(responseData);
            
            // Dynamically generate columns based on the parsed table
            if (this.dataSource.data.length > 0) {
              this.displayedColumns = Object.keys(this.dataSource.data[0]);
            }
          } 
          // Handle markdown table format
          else {
            this.percentageResponse = null; // Clear any percentage response
            this.dataSource.data = this.parseMarkdownTable(responseData);
            
            // Dynamically generate columns based on the parsed table
            if (this.dataSource.data.length > 0) {
              this.displayedColumns = Object.keys(this.dataSource.data[0]);
            }
          }

          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error occurred:', error);
          this.isLoading = false;
        }
      });
  }

  // Method to parse the structured text response
  parseStructuredTextResponse(text: string): any[] {
    const imagesData: any[] = [];
    const imageBlocks = text.split(/\*\*Image \d+\*\*/).filter(block => block.trim() !== '');

    imageBlocks.forEach(block => {
      const imageInfo: any = {};
      const lines = block.split('\n').filter(line => line.trim() !== '');
      
      lines.forEach(line => {
        const [key, value] = line.split(':').map(part => part.trim());
        if (key && value) {
          imageInfo[key.replace(/'/g, '').trim()] = value.replace(/'/g, '').trim();
        }
      });
      
      if (Object.keys(imageInfo).length > 0) {
        imagesData.push(imageInfo);
      }
    });

    return imagesData;
  }

  // Method to parse the markdown table into an array of objects
  parseMarkdownTable(markdown: string): any[] {
    const rows = markdown.split('\n').filter(row => row.startsWith('|')).slice(1); // Extract rows from the markdown
    const headers = rows[0].split('|').map(header => header.trim()).filter(header => header); // Get column headers

    return rows.slice(1).map(row => {
      const values = row.split('|').map(value => value.trim()).filter(value => value);
      const result: any = {};
      headers.forEach((header, index) => {
        result[header] = values[index];  // Assign column data
      });
      return result;
    });
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.submitQuery();
    }
  }
}
