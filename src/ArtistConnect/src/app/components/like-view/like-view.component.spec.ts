import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { of } from 'rxjs';

import { LikeViewComponent } from './like-view.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { environment } from 'src/environments/environment';


class AngularFirestoreMock {
    collection(path: string) {
        return {
            get: () => of({ docs: [] }),
            doc: (id: string) => ({
                get: () => of({ data: () => ({ displayName: 'Test User' }) }),
            }),
        };
    }
}

describe('LikeViewComponent', () => {
    let component: LikeViewComponent;
    let fixture: ComponentFixture<LikeViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AngularFireModule.initializeApp(environment.firebase),
                BrowserAnimationsModule,
                FontAwesomeModule,
                MatListModule,
            ],
            declarations: [LikeViewComponent],
            providers: [
                { provide: AngularFirestore, useClass: AngularFirestoreMock },
                { provide: MAT_DIALOG_DATA, useValue: { postID: 'test-post-id' } },
                FirebaseService,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LikeViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display "No likes yet!" when there are no likes', () => {
        component.likes = [];
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        const noLikesElement = compiled.querySelector('h3');
        expect(noLikesElement.textContent).toContain('No likes yet!');
    });

    it('should display likes when they are present', (done) => {
        component.likes = ['User 1', 'User 2'];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const compiled = fixture.nativeElement;
            const likeElements = compiled.querySelectorAll('mat-list-item');
            expect(likeElements.length).toBe(2);
            expect(likeElements[0].textContent).toContain('User 1');
            expect(likeElements[1].textContent).toContain('User 2');
            done();
        });
    });
});
