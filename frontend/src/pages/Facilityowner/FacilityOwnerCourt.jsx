import React from "react";
import { NavLink } from "react-router-dom";

function FacilityOwnerCourt() {
  return (
    <div>
      FacilityOwnerCourt
      <NavLink to={"add-court"}>Add court</NavLink>
    </div>
  );
}

export default FacilityOwnerCourt;