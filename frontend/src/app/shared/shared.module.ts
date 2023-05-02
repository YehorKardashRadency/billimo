import { StatusBadgeComponent } from './status-badge/status-badge.component';
import {Tab} from './tabs/tabs.component';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {InputComponent} from './input/input.component';
import {DialogComponent} from './success-modal-example/dialog.component';
import {ModalContainerComponent} from './modal/modal-container/modal-container.component';
import {ModalSuccessComponent} from './modal-success/modal-success.component';
import {ModalActionsContainerComponent} from './modal/modal-actions-container/modal-actions-container.component';
import {MatDialogModule} from '@angular/material/dialog';
import {ConfirmationModalExampleComponent} from './confirmation-modal-example/confirmation-modal-example.component';
import {ModalTitleComponent} from './modal/modal-title/modal-title.component';
import {EmptyStateComponent} from './empty-state/empty-state.component';
import {ButtonComponent} from './button/button.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {HeaderComponent} from './components/header/header.component';
import {TabsComponent} from './tabs/tabs.component';
import {TabComponent} from './tabs/tab/tab.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AboutUsComponent} from './about-us/about-us.component';
import {FormContainerComponent} from './form-container/form-container.component';
import {ProgressBarComponent} from './progress-bar/progress-bar.component';
import {SortDropdownComponent} from './sort-dropdown/sort-dropdown.component';
import {PaginationComponent} from "./pagination/pagination.component";
import {SearchInputComponent} from "./search-input/search-input.component";
import {DropdownComponent} from './dropdown/dropdown.component';
import {EnumPipe} from './pipes/enum.pipe';
import { SwitchComponent } from './switch/switch.component';
import { GenericErrorMessageComponent } from './generic-error-message/generic-error-message.component';
import {CurrencyFormatPipe} from "./pipes/currency.pipe";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { InvoiceTemplateNewComponent } from './components/invoice-template-new/invoice-template-new.component';
import { SuccessModalRedirectComponent } from './success-modal-redirect/success-modal-redirect.component';
import {TooltipDirective} from "./tooltip/directives/tooltip.directive";
import {DragndropComponent} from "./dragndrop/dragndrop.component";
import {TooltipComponent} from "./tooltip/tooltip.component";
import {CurrencyMaskModule} from "ng2-currency-mask";
import {Select} from "./select/select.component";
import {ModalModule} from "../core/resources/modules/modal/modal.module";
import { FilterButtonComponent } from './filter-button/filter-button.component';
import { FilterButtonSetComponent } from './filter-button-set/filter-button-set.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableHeaderCellComponent } from './table-header-cell/table-header-cell.component';
import { TableRowComponent } from './table-row/table-row.component';
import { TableRowCellComponent } from './table-row-cell/table-row-cell.component';
import { FailedModalRedirectComponent } from './failed-modal-redirect/failed-modal-redirect.component';
import { ModalFailedComponent } from './modal-failed/modal-failed.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import {invoiceNumberPipe} from "./pipes/invoiceNumber.pipe";

@NgModule({
  declarations: [
    AboutUsComponent,
    ModalActionsContainerComponent,
    DialogComponent,
    ModalContainerComponent,
    DropdownComponent,
    ModalSuccessComponent,
    ConfirmationModalExampleComponent,
    ModalTitleComponent,
    EmptyStateComponent,
    HeaderComponent,
    ButtonComponent,
    SpinnerComponent,
    TabsComponent,
    TabComponent,
    Tab,
    InputComponent,
    EnumPipe,
    invoiceNumberPipe,
    FormContainerComponent,
    ProgressBarComponent,
    DropdownComponent,
    SortDropdownComponent,
    PaginationComponent,
    SearchInputComponent,
    DropdownComponent,
    SwitchComponent,
    GenericErrorMessageComponent,
    CurrencyFormatPipe,
    InvoiceTemplateNewComponent,
    SuccessModalRedirectComponent,
    TooltipDirective,
    DragndropComponent,
    TooltipComponent,
    StatusBadgeComponent,
    Select,
    StatusBadgeComponent,
    FilterButtonComponent,
    FilterButtonSetComponent,
    CheckboxComponent,
    TableHeaderComponent,
    TableHeaderCellComponent,
    TableRowComponent,
    TableRowCellComponent,
    FailedModalRedirectComponent,
    ModalFailedComponent,
  ],
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
    RouterModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    ModalModule
  ],
  exports: [
    AboutUsComponent,
    EmptyStateComponent,
    HeaderComponent,
    ModalContainerComponent,
    ModalTitleComponent,
    SpinnerComponent,
    TabComponent,
    TabsComponent,
    Tab,
    ButtonComponent,
    EnumPipe,
    ModalActionsContainerComponent,
    ModalSuccessComponent,
    MatDialogModule,
    SortDropdownComponent,
    PaginationComponent,
    SearchInputComponent,
    DropdownComponent,
    ProgressBarComponent,
    FormContainerComponent,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    InvoiceTemplateNewComponent,
    SwitchComponent,
    GenericErrorMessageComponent,
    InputComponent,
    CurrencyFormatPipe,
    TooltipDirective,
    DragndropComponent,
    StatusBadgeComponent,
    Select,
    StatusBadgeComponent,
    FilterButtonComponent,
    FilterButtonSetComponent,
    CheckboxComponent,
    TableHeaderComponent,
    TableHeaderCellComponent,
    TableRowComponent,
    TableRowCellComponent,
    invoiceNumberPipe,
    FailedModalRedirectComponent,
    ModalFailedComponent,
  ],
})
export class SharedModule {
}
