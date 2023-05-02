import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {markAsTouched} from "ngrx-forms";

@Component({
  selector: 'app-dragndrop',
  templateUrl: './dragndrop.component.html',
  styleUrls: ['./dragndrop.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DragndropComponent),
    multi: true
  }]
})
export class DragndropComponent implements OnInit, ControlValueAccessor{
  @Input() accept = "image/svg+xml";
  @Input() multiple = false;
  @Output() change: EventEmitter<FileList | null> = new EventEmitter<FileList | null>();
  @ViewChild('fileInput') fileInput!: ElementRef;

  files: FileList | null = null;
  fileNames: string[] = [];

  click() {
    this.fileInput.nativeElement.click();
  }

  get value() {
    return this.files;
  }

  set value(val) {
    this.files = val;

    this.change.emit(this.files);
    this._onChange(this.files);
  }

  writeValue(value: FileList | null): void {
    this.value = value;
  }

  private _onChange(_: any) { }
  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(): void { }
  ngOnInit() { }

  takeFiles(files: FileList | null): void {
    if (!files)
      return;

    for (var i = 0; i < files.length; i++) {
      if (files[i].type != this.accept) {
        return;
      }
    }

    if (files.length > 0) {
      if (files.length > 1 && !this.multiple)
        return;

      this.writeValue(files);
      this.fileNames = this.getFileNames(files)
    }
  }

  getFileNames(files: FileList): string[]{
    const names:string[] = [];

    for(let i = 0; i < files.length; i++) {
      const name = files.item(i)?.name;
      if (name)
        names.push(name);
    }

    return names;
  }

  onClear(){
    this.writeValue(null);
    this.fileNames = [];
  }

  onDrop($event:DragEvent) {
    $event.preventDefault();

    if ($event.dataTransfer)
      this.takeFiles($event.dataTransfer.files);
  }

  onInput($event: Event) {
    const target = $event.target as HTMLInputElement;
    const files = target.files;

    this.takeFiles(files);
  }

  onDragOver($event: DragEvent) {
    $event.stopPropagation();
    $event.preventDefault();
  }

  onInputClick($event: MouseEvent) {
    ($event.target as HTMLInputElement).value = '';
  }
}
