import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Title } from '@angular/platform-browser';
import { DataService } from './data.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  public initialized = false;

  /** Hamburger icon to open menu */
  @ViewChild('swipeArea') hamburger: ElementRef;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public titleService: Title,
    public dataService: DataService,
    public router: Router,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 960px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.titleService.setTitle('InstiApp');
  }

  ngOnInit() {
    this.dataService.GetFillCurrentUser().subscribe(user => {
      this.initialized = true;
    }, (error) => {
      this.initialized = true;
    });
  }

  /** For use after router navigation */
  scrollToTop() {
    window.scrollTo(0, 0);
  }

  /** Unsubscribe from listeners */
  ngOnDestroy(): void {
      this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  /** Gets if the current router outlet state is `base` or `overlay` */
  getState(outlet) {
    return outlet.activatedRouteData.state;
  }

  /** Close sidebar only for mobile */
  closeSidebarMobile(drawer: any) {
    if (this.mobileQuery.matches) { drawer.close(); }
  }

  /** Redirects to login */
  login() {
    this.router.navigate(['login']);
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 60) {
      this.dataService.scrollBottomFunction();
    }
  }

}
