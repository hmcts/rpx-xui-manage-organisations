// Function to compare the users accessType selections with the most recently obtained ones
export function processAccessTypes(currentAccessTypes, userAccessTypeOptions) {
  const processedAccessTypes = [];

  const accessTypesMap = new Map();
  currentAccessTypes.forEach((jurisdiction) => {
    jurisdiction.accessTypes.forEach((accessType) => {
      const key = `${jurisdiction.jurisdictionid}-${accessType.organisationProfileId}-${accessType.accessTypeId}`;
      accessTypesMap.set(key, accessType);
    });
  });

  userAccessTypeOptions.accessTypes.forEach((userAccessType) => {
    const key = `${userAccessType.jurisdictionId}-${userAccessType.organisationProfileId}-${userAccessType.accessTypeId}`;
    const accessType = accessTypesMap.get(key);

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

  accessTypesMap.forEach((accessType, key) => {
    if (accessType.display) {
      const [jurisdictionId, organisationProfileId, accessTypeId] = key.split('-');
      processedAccessTypes.push({
        jurisdictionId,
        organisationProfileId,
        accessTypeId,
        enabled: accessType.accessDefault
      });
    }
  });

  return {
    ...userAccessTypeOptions,
    accessTypes: processedAccessTypes
  };
}
