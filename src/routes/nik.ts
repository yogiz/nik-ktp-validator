import { Hono } from "hono";
import { IdentificationID } from "../data/validator";
import { AdminArea } from "../data/adminAreaData";

const nik = new Hono();

nik.post("/", async (c) => {
  const { nik: NIKs, process } = await c.req.json();
  const adminAreaData: AdminArea[] = c.get("adminAreaData");

  let sumNumber = 0;
  let sumValidNumber = 0;
  let sumLength = 0;
  let sumArea = 0;
  let sumDob = 0;
  let sumGender = 0;
  let sumComputerized = 0;

  const errors: string[] = [];
  const dataFull: Record<string, any> = {};
  const dataLimited: Record<string, boolean> = {};

  for (const NIKValue of NIKs) {
    try {
      const NIK = new IdentificationID(NIKValue);

      const [statLength] = NIK.checkLength();
      const [statArea, nikProv, nikDistrict, nikSubdistrict] =
        NIK.checkAdminArea(adminAreaData);
      const [statDob, nikDob, nikAge] = NIK.checkDOB();
      const [statGender, nikGender] = NIK.checkGender();
      const [statComp, nikComp] = NIK.checkComputerizedNumber();

      const validAll =
        statLength && statArea && statDob && statGender && statComp;
      sumNumber++;
      sumValidNumber += validAll ? 1 : 0;
      sumLength += statLength ? 1 : 0;
      sumArea += statArea ? 1 : 0;
      sumDob += statDob ? 1 : 0;
      sumGender += statGender ? 1 : 0;
      sumComputerized += statComp ? 1 : 0;

      dataFull[NIKValue] = {
        data: {
          length: { value: NIKValue, valid: statLength },
          area: {
            value: {
              province: nikProv,
              district: nikDistrict,
              subdistrict: nikSubdistrict,
            },
            valid: statArea,
          },
          dob: { value: { dob: nikDob, age: nikAge }, valid: statDob },
          gender: { value: nikGender, valid: statGender },
          computerized: { value: nikComp, valid: statComp },
        },
        valid: validAll,
      };

      dataLimited[NIKValue] = validAll;
    } catch (error) {
      errors.push(NIKValue);
    }
  }

  const summary = {
    number: NIKs.length,
    number_processed: sumNumber,
    error: errors.length,
    valid: {
      all_section: sumValidNumber,
      section: {
        length: sumLength,
        area: sumArea,
        dob: sumDob,
        gender: sumGender,
        computerized: sumComputerized,
      },
    },
  };

  const response = {
    message: "success",
    errors,
    data: process === "full" ? dataFull : dataLimited,
    summary,
  };

  return c.json(response);
});

export default nik;
