import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class Main {
  
   private baseUrl = "http://192.168.5.46:8080/nivicapstage/api/public/leads" //environment.apiBaseUrl;

  constructor(public http: HttpClient) { }

   sendOTP(payload: any) : Observable<any>{
    return this.http.post<any>(
      `${this.baseUrl}/send-otp`,
      payload,
    );
  }

  verifyOTP(payload: any) : Observable<any>{
    return this.http.post<any>(
      `${this.baseUrl}/verify-otp`,
      payload,
    );
  }

  submitLead(payload: any) : Observable<any>{
    return this.http.post<any>(
      `${this.baseUrl}/submit`,
      payload,
    );
  }
}
