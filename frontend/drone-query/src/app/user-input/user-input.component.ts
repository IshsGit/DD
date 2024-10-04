import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf and *ngFor

@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, MatCardModule, FormsModule, HttpClientModule, CommonModule], // Add CommonModule here
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.scss'],
})
export class UserInputComponent {
  userInput: string = '';
  responseData: any;  

  constructor(private http: HttpClient) {} // Inject HttpClient

  submitQuery() {
    // Construct the URL for your FastAPI endpoint
    const apiUrl = 'http://localhost:8000/process-query/'; 

    // Send a POST request with the user input
    this.http.post(apiUrl, { query: this.userInput })
      .subscribe({
        next: (response) => {
          console.log('Response from server:', response);
          this.responseData = response;  // Store the response data
        },
        error: (error) => {
          console.error('Error occurred:', error);
        }
      });
  }
}
