import { showSpinner } from './../../../../store/actions/spinner.actions';
import { selectRole } from './../../../../store/selectors/auth.selectors';
import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonConfig } from "../../../../shared/button/button.component";
import { CompanyAccountComponent } from "../../company-account.component";
import { Observable, Subscription} from "rxjs";
import { select, Store } from "@ngrx/store";
import { selectDocuments } from "./state/documents.selectors";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { loadDocuments, updateDocuments } from "./state/documents.actions";
import { DocumentsModel } from "./resources/models/documents.model";
import { createImageFilesizeValidator } from "./resources/validators/imageFilesize.validator";
import { Role } from 'src/app/modules/auth/resources/models/Role';
import {EmailDuplicateValidator} from "./resources/validators/emailDuplicate.validator";
import {DocumentsService} from "./resources/services/documents.service";

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('templateRef') templateRef!: TemplateRef<any>
  config: ButtonConfig = {
    text: "Save",
    onClick: undefined,
  }

  accept = "image/svg+xml";
  documents$?: Subscription;
  imageLoading$?: Subscription;
  businessTypes = ['Sole proprietorship', 'Partnership', 'Corporation', 'Limited liability company (LLC)', 'Cooperative'];

  form = new FormGroup({
    "name": new FormControl<string>("", [Validators.required]),
    "email": new FormControl<string>("",{
      validators: [Validators.required,Validators.email],
      asyncValidators: [EmailDuplicateValidator.createValidator(this.documentsService)],
    } ),
    "businessType": new FormControl<string>("", Validators.required),
    "logo": new FormControl<string>("", Validators.required),
    "logoFile": new FormControl<FileList | null>(null, [createImageFilesizeValidator(2)]),
    "tax": new FormControl<string>("", Validators.required),
    "registration": new FormControl<string>("", Validators.required),
  });

  role$: Subscription;
  canEdit = false;
  constructor(private companyAccount: CompanyAccountComponent, private store$: Store,
    private domSanitizer: DomSanitizer,private documentsService: DocumentsService) {

    this.role$ = this.store$.pipe(select(selectRole)).subscribe(role => {
      this.canEdit = role == Role.Admin || role == Role.Director;
      if (!this.canEdit)
        this.form.disable()
    })
  }

  ngOnInit(): void {
    this.store$.dispatch(showSpinner());
    this.store$.dispatch(loadDocuments());
    this.documents$ = this.store$.select(selectDocuments).subscribe(document => {
      if (document)
        this.form.patchValue({
          name: document.name, email: document.email, logo: document.logo, tax: document.tax,
          registration: document.registration, businessType: this.businessTypes[document.businessType]
        });
    });
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => this.companyAccount.setLowerSection(this.templateRef));
  }

  ngOnDestroy(): void {
    Promise.resolve().then(() => this.companyAccount.setLowerSection(undefined));
    this.role$.unsubscribe();
    this.documents$?.unsubscribe();
    this.imageLoading$?.unsubscribe();
  }

  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.value;
    const model: DocumentsModel = {
      name: values.name!,
      email: values.email!,
      businessType: this.businessTypes.indexOf(values.businessType!),
      logo: values.logo!,
      tax: values.tax!,
      registration: values.registration!,
    }

    this.store$.dispatch(updateDocuments({ model: model }));
  }

  toSafeUrl(): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl('' + this.form.controls.logo.value);
  }

  loadImage$(logo: File): Observable<string> {
    return new Observable<string>(observer => {
      const reader = new FileReader();
      reader.onerror = err => observer.error(err);
      reader.onabort = () => observer.error('aborted');
      reader.onload = () => observer.next(reader.result as string);
      reader.readAsDataURL(logo);
      return () => reader.abort();
    });
  }

  onChangeLogo(files: FileList | null) {
    if (files && files.length == 1)
      this.handleImage(files.item(0));
  }

  handleImage(file: File | null) {
    if (!file)
      return;

    this.imageLoading$ = this.loadImage$(file).subscribe(logo => {
      this.showPreview(logo);
    });
  }

  showPreview(logo: string) {
    const errors = this.form.controls.logoFile.errors;
    if (errors && errors['invalidFilesize']) {
      this.form.patchValue({ logo: null });
    } else {
      this.form.patchValue({ logo: logo });
    }
  }

  showDragnDrop(): boolean {
    const errors = this.form.controls.logoFile.errors;
    return !this.form.controls.logo.value || (errors != null && errors['invalidFilesize'] != null);
  }
}
