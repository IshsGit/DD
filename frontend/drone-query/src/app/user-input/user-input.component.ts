import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Import the spinner module
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule, // Add the spinner module here
    FormsModule,
    HttpClientModule,
    CommonModule,
  ],
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.scss'],
})
export class UserInputComponent {
  userInput: string = '';
  responseData: any;  
  isLoading: boolean = false; // Initialize loading state

  constructor(private http: HttpClient) {}

  submitQuery() {
    const apiUrl = 'http://localhost:8000/process-query/'; 

    // Set loading state to true when the query is submitted
    this.isLoading = true; 

    this.http.post(apiUrl, { query: this.userInput })
      .subscribe({
        next: (response) => {
          console.log('Response from server:', response);
          this.responseData = response;  
          this.isLoading = false; // Reset loading state once response is received
        },
        error: (error) => {
          console.error('Error occurred:', error);
          this.isLoading = false; // Reset loading state on error
        }
      });
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.submitQuery();
    }
  }
}
