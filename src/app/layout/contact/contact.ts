import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [CommonModule,HttpClientModule,FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {

  constructor(private http:HttpClient){}

submitForm(form: any) {
    if (!form.valid) {
      alert("Please fill all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append('name', form.value.name);
    formData.append('email', form.value.email);
    formData.append('phone', form.value.phone);
    formData.append('subject', form.value.subject);
    formData.append('message', form.value.message);

    this.http.post(
      "https://nivicap.com/nivicap/send-mail.php",
      formData,
      { responseType: 'text' }
    )
    .subscribe({
      next: (res) => {
        alert("Your inquiry has been sent successfully!");
        form.reset();
      },
      error: () => {
        alert("Failed to send email.");
      }
    });
  }
}
