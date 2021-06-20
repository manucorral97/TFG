import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';

const myModules = [MatToolbarModule, MatSidenavModule, MatButtonModule, MatMenuModule, MatListModule, MatIconModule, MatInputModule,
                MatCardModule, MatTableModule, MatSortModule, MatExpansionModule,MatFormFieldModule,MatSelectModule, MatDatepickerModule,
                MatNativeDateModule, MatPaginatorModule];

@NgModule({
    imports: [ ... myModules],
    exports: [ ... myModules],
})

export class MaterialModule {}