import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriesPageComponent } from './categories-page/categories-page.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { LayoutModule } from '../layout/layout.module';
import { MatIconModule } from '@angular/material/icon';
import { CategoryItemComponent } from './categories-page/category-item/category-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryAddComponent } from './categories-page/category-add/category-add.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: CategoriesPageComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [
    CategoriesPageComponent,
    CategoryItemComponent,
    CategoryAddComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LayoutModule,
    MatIconModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
  ],
})
export class CategoriesModule {}
