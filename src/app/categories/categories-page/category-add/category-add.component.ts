import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICategory } from '../../category.model';
import { CategoryService } from '../../category.service';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss'],
})
export class CategoryAddComponent implements OnInit {
  @Output() addCategory = new EventEmitter();
  categories: ICategory[] = [];
  expenseCategories: ICategory[] = [];
  incomeCategories: ICategory[] = [];
  subscription: Subscription = new Subscription();
  categoryForm = new FormGroup({
    title: new FormControl(null, [
      Validators.required,
      this.checkIsUnique.bind(this),
    ]),
    type: new FormControl(null, Validators.required),
  });

  onClose() {
    this.categoryForm.reset();
    this.categoryForm.markAsUntouched();
    this.categoryService.closeCategoryMode.next(true);
  }

  changeType(type: string) {
    if (type === 'expense') {
      this.categories = this.expenseCategories;
    } else if (type === 'income') {
      this.categories = this.incomeCategories;
    }
  }

  checkIsUnique(control: AbstractControl): { [key: string]: boolean } | null {
    let isUnique = false;
    if (this.categories.length > 0) {
      this.categories.forEach((category) => {
        if (
          control.value &&
          category.title &&
          category.title.toLowerCase() === control.value.trim().toLowerCase()
        ) {
          isUnique = true;
        }
      });
    }
    return isUnique ? { isUnique: true } : null;
  }

  onAddCategory(formDirective: FormGroupDirective) {
    this.addCategory.emit(this.categoryForm.value);
    this.onClose();
    formDirective.resetForm();
  }

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (categories: ICategory[]) => {
        this.categories = categories;
        this.expenseCategories = this.categories.filter(
          (category) => category.type === 'expense'
        );
        this.incomeCategories = this.categories.filter(
          (category) => category.type === 'income'
        );
      },
    });
  }
}
