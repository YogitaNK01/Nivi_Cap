import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-index',
   standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index {
isScrolled = false;
activeSection: string = 'home';

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 800;
  }

constructor(private http:HttpClient){}

ngAfterViewInit() {
  const sections = document.querySelectorAll("section");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.activeSection = entry.target.id;
      }
    });
  }, {
    threshold: 0.6 // 60% of section visible → active
  });

  sections.forEach(section => observer.observe(section));
}


  // Scroll to a specific section
  scrollToSection(sectionId: string): void {
    this.activeSection = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

// ----------------------submit form---------------
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
