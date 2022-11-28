import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoaderService } from '../shared/services/loader.service';
import { ICategory } from './category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  public closeCategoryMode = new Subject<boolean>();
  public errorMessage = new Subject<HttpErrorResponse>();

  getCategories(): Observable<ICategory[]> {
    this.loaderService.isVisible.next(true);
    return this.http
      .get<ICategory[]>(`${environment.API_URL}/categories`, {})
      .pipe(
        tap({
          complete: () => {
            this.loaderService.isVisible.next(false);
          },
          error: (err) => {
            this.errorMessage.next(err);
            this.loaderService.isVisible.next(false);
          },
        })
      );
  }

  deleteCategoryById(id: string): Observable<ICategory> {
    this.loaderService.isVisible.next(true);
    return this.http
      .delete<ICategory>(`${environment.API_URL}/categories/${id}`)
      .pipe(
        tap({
          complete: () => {
            this.loaderService.isVisible.next(false);
          },
          error: (err) => {
            this.errorMessage.next(err);
            this.loaderService.isVisible.next(false);
          },
        })
      );
  }

  updateCategoryById(
    id: string,
    payload: { title: string }
  ): Observable<ICategory> {
    return this.http
      .put<ICategory>(`${environment.API_URL}/categories/${id}`, payload)
      .pipe(
        tap({
          error: (err) => {
            this.errorMessage.next(err);
            this.loaderService.isVisible.next(false);
          },
        })
      );
  }

  addCategory(payload: { title: string; type: string }): Observable<ICategory> {
    this.loaderService.isVisible.next(true);
    return this.http
      .post<ICategory>(`${environment.API_URL}/categories`, payload)
      .pipe(
        tap({
          complete: () => {
            this.loaderService.isVisible.next(false);
          },
          error: (err) => {
            this.errorMessage.next(err);
            this.loaderService.isVisible.next(false);
          },
        })
      );
  }

  constructor(private http: HttpClient, private loaderService: LoaderService) {}
}
