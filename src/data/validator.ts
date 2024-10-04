import { DateTime } from "luxon";

export class IdentificationID {
  constructor(private ID: string) {}

  getValue(): string {
    return this.ID;
  }

  checkLength(): [boolean, number] {
    const length = this.ID.length;
    return [length === 16, length];
  }

  checkAdminArea(
    data: any[]
  ): [boolean, string | null, string | null, string | null] {
    const adminCode = this.ID.slice(0, 6);
    const row = data.find((row) => row.code === adminCode);
    if (row) {
      return [true, row.province, row.district, row.subdistrict];
    }
    return [false, null, null, null];
  }

  checkDOB(): [boolean, string | null, number | null] {
    let dob = this.ID.slice(6, 12);
    let dobPerson = parseInt(dob);

    if (dobPerson > 400000) {
      dobPerson -= 400000;
    }

    try {
      let dobDate = DateTime.fromFormat(dobPerson.toString(), "ddMMyy");
      if (dobDate > DateTime.now()) {
        dobDate = dobDate.minus({ years: 100 });
      }

      const age = DateTime.now().diff(dobDate, "years").years;
      const dobString = dobDate.toFormat("dd-MM-yyyy");

      if (age >= 17) {
        return [true, dobString, Math.floor(age)];
      }
      return [false, dobString, Math.floor(age)];
    } catch {
      return [false, null, null];
    }
  }

  checkGender(): [boolean, string | null] {
    const gender = parseInt(this.ID.charAt(6));
    if (gender >= 0 && gender <= 7) {
      return [true, gender <= 3 ? "Man" : "Woman"];
    }
    return [false, null];
  }

  checkComputerizedNumber(): [boolean, string] {
    const lastNum = this.ID.slice(12);
    return [lastNum !== "0000", lastNum];
  }
}
