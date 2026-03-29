import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { SidebarModule } from "primeng/sidebar";
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { RippleModule } from 'primeng/ripple';
import { ConfirmationService, MessageService } from 'primeng/api';

import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { StepsModule } from 'primeng/steps';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FileUploadModule } from 'primeng/fileupload';
import { PaginatorModule } from 'primeng/paginator';
import { EditorModule } from 'primeng/editor';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';
import {BadgeModule} from 'primeng/badge';
import { DragDropModule } from 'primeng/dragdrop';
// import { ChartModule } from 'primeng/chart';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AutoCompleteModule,
    DialogModule,
    ButtonModule,
    MessagesModule,
    MessageModule,
    ConfirmDialogModule,
    InputTextModule,
    CalendarModule,
    CheckboxModule,
    DropdownModule,
    InputTextareaModule,
    RadioButtonModule,
    TableModule,
    ToastModule,
    RippleModule,
    CardModule,
    MenuModule,
    FieldsetModule,
    TooltipModule,
    TabViewModule,
    SidebarModule,
    MultiSelectModule,
    InputNumberModule,
    InputSwitchModule,
    StepsModule,
    ProgressSpinnerModule,
    FileUploadModule,
    PaginatorModule,
    EditorModule,
    AccordionModule,
    TagModule,
    BadgeModule,
    DragDropModule
    // ChartModule
  ],
  exports: [
    AutoCompleteModule,
    DialogModule,
    ButtonModule,
    MessagesModule,
    MessageModule,
    ConfirmDialogModule,
    InputTextModule,
    CalendarModule,
    CheckboxModule,
    DropdownModule,
    InputTextareaModule,
    RadioButtonModule,
    TableModule,
    ToastModule,
    RippleModule,
    CardModule,
    MenuModule,
    FieldsetModule,
    SidebarModule,
    TooltipModule,
    TabViewModule,
    MultiSelectModule,
    InputNumberModule,
    InputSwitchModule,
    StepsModule,
    ProgressSpinnerModule,
    FileUploadModule,
    EditorModule,
    AccordionModule,
    TagModule,
    BadgeModule,
    DragDropModule

    // ChartModule
  ],
  providers: [MessageService, ConfirmationService],
})
export class PrimengModule {}
