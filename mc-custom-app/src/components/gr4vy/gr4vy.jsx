import React, { useState, useEffect } from 'react';
import { useAsyncDispatch, actions } from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { getField, formSections } from './fields';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import ClipLoader from 'react-spinners/ClipLoader';
import useStateWithCallback from '../../hooks/useStateWithCB';
import initialValues from './intiValues.json';

const Gr4vy = () => {
  const [sections, setSections] = useState(formSections);
  const override = {
    display: 'block',
    margin: '0 auto',
    borderColor: 'black',
  };
  let [loading, setLoading] = useState(false);
  const customObject = useStateWithCallback(initialValues);
  const dispatch = useAsyncDispatch();
  const [privateIdFile, setPrivateIdFile] = useState({});

  const fetchCustomObject = async () => {
    setLoading(true);
    try {
      const result = await dispatch(
        actions.get({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          service: 'customObjects',
        })
      );
      const { results } = result;
      const CustObj = results.filter(
        (res) => res.container === 'gr4vy-test-container'
      )[0].value;
      customObject.set(CustObj);
    } catch (error) {
      // Update state with `error`
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // const parseJSON2Form = (payload) => {
  //   const form_data = new FormData();
  //   for (let key in payload) {
  //     if (key === 'privateId' && privateIdFile.hasOwnProperty(key)) {
  //       form_data.append(key, privateIdFile[key], privateIdFile[key].name);
  //     } else {
  //       form_data.append(key, payload[key].length ? payload[key] : '');
  //     }
  //   }
  //   return form_data;
  // };

  const saveCustomObject = async (payload) => {
    setLoading(true);
    try {
      // const formData = await parseJSON2Form(payload);
      if (privateIdFile.hasOwnProperty('privateId')) {
        payload['privateId'] = privateIdFile['privateId'];
      }
      console.log('saving', payload);

      const result = await dispatch(
        actions.post({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          service: 'customObjects',
          // headers: {
          //   'Content-Type': 'multipart/form-data',
          // },
          payload: {
            container: 'gr4vy-test-container',
            key: 'gr4vy-config-1',
            value: payload,
          },
        })
      );
      fetchCustomObject();
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomObject();
  }, []);

  let formik = useFormik({
    initialValues: customObject.get(),
    onSubmit: (values) => {
      saveCustomObject(values);
    },
    enableReinitialize: true,
  });

  const handleFile = (e) => {
    privateIdFile[e?.target?.name] = e?.currentTarget?.files[0];
    setPrivateIdFile((privateIdFile) => {
      return { ...privateIdFile };
    });
  };

  console.log('privateKeyIdFile:', privateIdFile);

  useEffect(() => {
    if (formik.values.paymentFromApplicableCountries) {
      setSections((sections) => {
        sections[0].subSections[0].children[12].disabled = false;
        return sections;
      });
    }
  }, [formik.values]);

  return (
    <>
      <ClipLoader
        color={'#ffffff'}
        loading={loading}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      {!loading ? (
        <form onSubmit={formik.handleSubmit}>
          <Spacings.Stack scale="l">
            {sections &&
              sections.map((section, indexSection) => (
                <React.Fragment key={`section-${indexSection}`}>
                  <Text.Headline as="h2">{section.name}</Text.Headline>
                  {section?.subSections.map((subSection, indexSubSection) => (
                    <React.Fragment key={`subSection-${indexSubSection}`}>
                      <Text.Body>{subSection?.name}</Text.Body>
                      {subSection?.children.map((field, indexField) =>
                        getField({
                          id: field?.id,
                          type: field?.type,
                          title: field?.title,
                          value: formik.values[`${field?.id}`],
                          name: field?.id,
                          eventTrigger:
                            field?.type === 'file'
                              ? handleFile
                              : formik.handleChange,
                          options: field?.options,
                          disabled: field?.disabled,
                          key: indexField,
                        })
                      )}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            <button type="submit">Submit</button>
          </Spacings.Stack>
        </form>
      ) : null}
    </>
  );
};

Gr4vy.displayName = 'Gr4vy';
Gr4vy.propTypes = {
  linkToWelcome: PropTypes.string.isRequired,
};

export default Gr4vy;
