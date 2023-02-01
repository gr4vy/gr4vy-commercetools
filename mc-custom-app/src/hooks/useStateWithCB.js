import React, { useState } from 'react';

export default function useStateWithCallback(initialValue) {
  const [trait, updateTrait] = useState(initialValue);

  let current = trait;

  const get = () => current;

  const set = (newValue) => {
    current = newValue;
    updateTrait(newValue);
    return current;
  };

  return {
    get,
    set,
  };
}

/* SAMPLE PAYLOAD
    {
      container: 'gr4vy-test-container',
      key: 'gr4vy-config-1',
      value: {
         info: 'Currently installed version: 1.0.22',
          enabled: 1,
          display: 'webcheckout',
          gr4vyId: 'adfasf',
          privateId: '',
          env: 'production',
          enableDebug: 1,
          paymentAction: 'capture',
          title: 'title',
          instructions: 'zcvxfv\ndsvggsdfv\ndfvdsv\nvdsf\nvsdv ',
          newOrderStatus: 'fraud',
          paymentFromApplicableCountries: 1,
          paymentFromApplicableCountriesList: null,
          sortOrder: 'q35434',
          paymentSource: null,
          paymentStore: null,
          customData: '',
          requireSecurityCode: null,
          statementName: '',
          statementDescription: '',
          stateCity: 'vsfdvsdfvsdfv vsdv',
          statementPhoneNumber: 'fvddfxv',
          statementUrl: 'sfvcsdvdfvsdfv',
          fontBody: 'vdfv',
          textColor: '#1297d9',
          subtleTextColor: '#e61919',
          labelTextColor: '#bbbe23',
          primaryColor: '#f2eded',
          pageBackgroundColor: '#c12adf',
          containerBackgroundUncheckColor: '',
          containerBackgroundColor: '#f6eeee',
          containerBorderColor: '#441d1d',
          inputBorderColor: '#d56262',
          inputBackgroundColor: '',
          inputTextColor: '#5163a9',
          inputRadioBorderColor: '#2e17de',
          inputRadioBorderCheckedColor: '#1a9990',
          dangerColor: '#0fb89c',
          dangerBackgroundColor: '',
          dangerTextColor: '#6ddb24',
          infoColor: '',
          infoBackgroundColor: '#7d9118',
          infoTextColor: '',
          focusColor: '',
          containerBorderWidth: '423',
          inputBorderWidth: '342',
          container: '34fdf',
          input: 'dvsd',
          focusRing: '#230606',
        },
      },
    */
