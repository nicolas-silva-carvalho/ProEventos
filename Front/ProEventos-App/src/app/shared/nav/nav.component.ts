import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.component.html',
  imports: [CollapseModule, BsDropdownModule, RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  isCollapsed = true;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  showMenu(): boolean {
    console.log('Current URL:', this.router.url);
    return this.router.url !== '/user/login';
  }
}
