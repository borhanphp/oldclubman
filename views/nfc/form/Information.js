import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindNfcData } from "../store";
import OldInput from '@/components/custom/OldInput';

const Information = () => {
  const dispatch = useDispatch();
  const basicNfcData = useSelector(state => state.nfc.basicNfcData);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    dispatch(bindNfcData({ ...basicNfcData, [name]: value }));
  };

  return (
    <div className="">
      {/* Personal Section */}
      <div className="mb-8">
        <h3 className="font-bold text-md mb-2">Personal</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <OldInput
              label="Prefix"
              type="text"
              name="prefix"
              value={basicNfcData?.prefix}
              onChange={handleInfoChange}
              placeholder="Prefix"
              className="w-full"
            />
          </div>
          <div>
            <OldInput
              label="First Name"
              type="text"
              name="first_name"
              value={basicNfcData.first_name}
              onChange={handleInfoChange}
              placeholder="First name"
              className="w-full"
            />
          </div>
          <div>
            <OldInput
              label="Middle Name"
              type="text"
              name="middle_name"
              value={basicNfcData.middle_name}
              onChange={handleInfoChange}
              placeholder="Middle Name"
              className="w-full"
            />
          </div>
          <div>
            <OldInput
              label="Last Name"
              type="text"
              name="last_name"
              value={basicNfcData.last_name}
              onChange={handleInfoChange}
              placeholder="Last Name"
              className="w-full"
            />
          </div>
          <div>
            <OldInput
              label="Suffix"
              type="text"
              name="suffix"
              value={basicNfcData.suffix}
              onChange={handleInfoChange}
              placeholder="Suffix"
              className="w-full"
            />
          </div>
          <div>
            <OldInput
              label="Accreditations"
              type="text"
              name="accreditations"
              value={basicNfcData.accreditations}
              onChange={handleInfoChange}
              placeholder="Accreditations"
              className="w-full"
            />
          </div>
          <div>
            <OldInput
              label="Preferred Name"
              type="text"
              name="preferred_name"
              value={basicNfcData.preferred_name}
              onChange={handleInfoChange}
              placeholder="Preferred Name"
              className="w-full"
            />
          </div>
          <div>
            <OldInput
              label="Maiden Name"
              type="text"
              name="maiden_name"
              value={basicNfcData.maiden_name}
              onChange={handleInfoChange}
              placeholder="Maiden Name"
              className="w-full"
            />
          </div>
          <div>
            <OldInput
              label="Pronoun"
              type="text"
              name="pronoun"
              value={basicNfcData.pronoun}
              onChange={handleInfoChange}
              placeholder="Pronoun"
              className="w-full"
            />
          </div>
        </div>
      </div>
      {/* Affiliation Section */}
      <div className="mb-2">
        <h3 className="font-bold text-md mb-2">Affiliation</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <OldInput
              label="Title"
              type="textarea"
              name="title"
              value={basicNfcData.title}
              onChange={handleInfoChange}
              placeholder="Title"
              className="w-full"
              rows={2}
            />
          </div>
          <div>
            <OldInput
              label="Department"
              type="text"
              name="department"
              value={basicNfcData.department}
              onChange={handleInfoChange}
              placeholder="Department"
              className="w-full"
            />
          </div>
          <div>
            <OldInput
              label="Company"
              type="text"
              name="company"
              value={basicNfcData.company}
              onChange={handleInfoChange}
              placeholder="Company Name"
              className="w-full"
            />
          </div>
          <div>
            <OldInput
              label="Headline"
              type="text"
              name="headline"
              value={basicNfcData.headline}
              onChange={handleInfoChange}
              placeholder="Headline"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information; 