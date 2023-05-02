import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function createImageFilesizeValidator(megabytes: number): ValidatorFn {
  return (control:AbstractControl<FileList | null>) : ValidationErrors | null => {
    const files = control.value;

    if (!files) {
      return null;
    }

    for(let i = 0;i < files.length; i++){
      const item = files.item(i);
      if (item && item.size > megabytes * 1048576){
        return {invalidFilesize: true};
      }
    }

    return null;
  }
}
