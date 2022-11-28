import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';
import { ICategory } from '../category.model';
import { CategoryService } from '../category.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss'],
})
export class CategoriesPageComponent implements OnInit {
  open = false;
  categories: ICategory[] = [];
  categoriesForOutput: ICategory[] = [];
  searchText = '';
  subscription: Subscription = new Subscription();
  isError = false;
  errorMessage = '';

  openedChanged(open: boolean) {
    this.open = open;
  }

  searchKey(data: string) {
    this.searchText = data;
    this.search();
  }

  search() {
    this.categoriesForOutput = this.categories.filter((category) => {
      return (
        category.title.toLowerCase().indexOf(this.searchText.toLowerCase()) !==
        -1
      );
    });
  }

  constructor(private categoryService: CategoryService) {}

  getCategories() {
    this.subscription.add(
      this.categoryService.getCategories().subscribe({
        next: (categories: ICategory[]) => {
          this.categories = categories;
          this.categoriesForOutput = this.categories;
        },
      })
    );
  }

  onDeleteCategory(id: string) {
    this.subscription.add(
      this.categoryService.deleteCategoryById(id).subscribe({
        next: (res) => {
          this.categories = this.categories.filter(
            (category) => category._id !== res._id
          );
          this.categoriesForOutput = this.categoriesForOutput.filter(
            (category) => category._id !== res._id
          );
        },
      })
    );
  }

  onUpdateCategory(payload: { title: string; id: string }) {
    this.subscription.add(
      this.categoryService.updateCategoryById(payload.id, payload).subscribe({
        next: (res) => {
          this.categories = this.categories.map((category) => {
            if (category._id === res._id) {
              return res;
            }
            return category;
          });
          this.categoriesForOutput = this.categoriesForOutput.map(
            (category) => {
              if (category._id === res._id) {
                return res;
              }
              return category;
            }
          );
        },
      })
    );
  }

  onAddCategory(payload: { title: string; type: string }) {
    this.subscription.add(
      this.categoryService.addCategory(payload).subscribe({
        next: () => {
          this.getCategories();
        },
      })
    );
  }

  ngOnInit(): void {
    this.getCategories();
    this.subscription.add(
      this.categoryService.closeCategoryMode.subscribe(() => {
        this.open = false;
      })
    );

    this.subscription.add(
      this.categoryService.errorMessage.subscribe({
        next: (errorMessage: HttpErrorResponse) => {
          this.isError = true;
          this.errorMessage = errorMessage.error.error;

          setTimeout(() => {
            this.isError = false;
            this.errorMessage = '';
          }, 2000);
        },
      })
    );
  }
}
