import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Index } from './index';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [Index,HttpClientModule ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Nivi Capital');
}
