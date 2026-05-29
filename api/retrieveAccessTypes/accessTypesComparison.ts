// Function to compare the users accessType selections with the most recently obtained ones
export function processAccessTypes(currentOrganisationAccessTypes, userAccessTypeOptions) {
  const processedAccessTypes = [];
  const accessTypesMap = new Map();
  currentOrganisationAccessTypes.forEach((jurisdiction) => {
    jurisdiction.accessTypes.forEach((accessType) => {
      const key = JSON.stringify([
        jurisdiction.jurisdictionId,
        accessType.organisationProfileId,
        accessType.accessTypeId
      ]);
      accessTypesMap.set(key, {
        jurisdictionId: jurisdiction.jurisdictionId,
        accessType
      });
    });
  });

  userAccessTypeOptions.userAccessTypes.forEach((userAccessType) => {
    const key = JSON.stringify([
      userAccessType.jurisdictionId,
      userAccessType.organisationProfileId,
      userAccessType.accessTypeId
    ]);
    const accessTypeEntry = accessTypesMap.get(key);
    const accessType = accessTypeEntry?.accessType;

    if (accessType && accessType.display) {
      if (accessType.accessMandatory && accessType.accessDefault) {
        // If access type is mandatory and default is true, set it to true
        processedAccessTypes.push({
          jurisdictionId: userAccessType.jurisdictionId,
          organisationProfileId: userAccessType.organisationProfileId,
          accessTypeId: userAccessType.accessTypeId,
          enabled: true
        });
      } else {
        // For non-mandatory access types or mandatory with default false, use user's selection
        processedAccessTypes.push(userAccessType);
      }
    }

    // Remove the processed access type from the map
    accessTypesMap.delete(key);
  });

  accessTypesMap.forEach((accessTypeEntry) => {
    const accessType = accessTypeEntry.accessType;
    if (accessType.display) {
      processedAccessTypes.push({
        jurisdictionId: accessTypeEntry.jurisdictionId,
        organisationProfileId: accessType.organisationProfileId,
        accessTypeId: accessType.accessTypeId,
        enabled: accessType.accessDefault
      });
    }
  });

  return {
    ...userAccessTypeOptions,
    userAccessTypes: processedAccessTypes
  };
}
