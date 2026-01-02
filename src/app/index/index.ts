import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Main } from '../service/main';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index {
  isScrolled = false;
  activeSection: string = 'home';

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (window.location.pathname !== '/') return;
    this.isScrolled = window.scrollY > 800;
  }

  loanAmount: string = '';

  showOtp: boolean = false;
  otpBoxes = Array(6);
  otp: string[] = ['', '', '', '', '', ''];
  timer = 60;
  isAgreed: boolean = false;
  otpSent = false;

  showsuccess: boolean = false;
  successmsg: any;

  constructor(private http: HttpClient, private main: Main) { }

  ngAfterViewInit() {
    if (window.location.pathname !== '/') return;

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


  //format amount 2000000 to 20,00,000
  formatAmount() {
    if (!this.loanAmount) return;

    let value = this.loanAmount.replace(/,/g, '');

    // block non-digit characters
    value = value.replace(/\D/g, '');

    this.loanAmount = this.formatIndian(value);
  }

  formatIndian(x: string): string {
    if (!x) return '';
    let lastThree = x.substring(x.length - 3);
    let otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers !== '') lastThree = ',' + lastThree;
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  }
  //loan form
  onAgreeChange(event: any) {
    this.isAgreed = event.target.checked;
  }

  sendOtptouser(form: any) {
    console.log(form)
    this.startTimer()

    if (form.invalid || !this.isAgreed) return;

    // Call your OTP API here
    const inputobj = {
      "mobileNumber": form.value.phone,


    }
    this.main.sendOTP(inputobj).subscribe({
      next: (res) => {
        console.log("send otp---", res.message)
        this.showOtp = true;
      }
    })
  }

  verify_Otp(form: any) {
    const code = this.otp.join('');
    if (code.length !== 6) return;
    let otp = form.value.otp0 + form.value.otp1 + form.value.otp2 + form.value.otp3 + form.value.otp4 + form.value.otp5
    const inputobj = {
      "mobileNumber": form.value.phone,
      "otp": otp
    }

    this.main.verifyOTP(inputobj).subscribe({
      next: (res) => {
        console.log("verify otp---", res.message)

        this.submitLoanForm(form.value)
      }
    })
  }


  submitLoanForm(data: any) {
    console.log("submit form---", data)
    const inputobj = {
      "fullName": data.name,
      "mobileNumber": data.phone,
      "email": data.email,
      "loanAmount": data.loanAmount,
      "preferredCountry": data.country

    }

    this.main.submitLead(inputobj).subscribe({
      next: (res) => {
        this.showsuccess = true;
        this.successmsg = res.message
        console.log("submit lead---", res.message)

      }
    })

    this.showsuccess = false;
  }


  startTimer() {
    this.timer = 60;
    const interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }


  moveToNext(event: any, index: number) {
    const input = event.target;
    if (input.value && index < 5) {
      const next = input.nextElementSibling;
      next?.focus();
    }
  }

  moveToPrev(event: any, index: number) {
    if (!this.otp[index] && index > 0) {
      const prev = event.target.previousElementSibling;
      prev?.focus();
    }
  }
}
