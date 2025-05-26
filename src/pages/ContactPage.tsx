import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../../context/ThemeContext';
import MinimalLayout from '../../components/layout/MinimalLayout';
import '../../styles/pages/contact.css';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface ContactPageProps {}

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

const ContactPage: React.FC<ContactPageProps> = () => {
  const { isDarkMode } = useTheme();
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
    const rotationSpeed = 0.01;
    const { scene } = useThree();

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    message: Yup.string().required('Message is required'),
  });

  const handleSubmit = useCallback(async (values: ContactFormValues, { resetForm }) => {
    setSubmissionStatus('loading');
    setSubmissionError(null);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Form values:', values);
      resetForm();
      setSubmissionStatus('success');
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmissionStatus('error');
      setSubmissionError('An error occurred while submitting the form. Please try again.');
    }
  }, []);

    useFrame(() => {
        if (sphereRef.current) {
            sphereRef.current.rotation.x += rotationSpeed;
            sphereRef.current.rotation.y += rotationSpeed;
        }
    });

  return (
    <MinimalLayout>
      <section className="contact-page">
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-3xl font-semibold mb-6 text-center">Contact Us</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <p>Email: support@example.com</p>
              <p>Phone: (123) 456-7890</p>
              <p>Address: 123 Main St, Anytown USA</p>
            </div>
            <div>
              <Formik
                initialValues={{ name: '', email: '', message: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium">
                        Name
                      </label>
                      <Field
                        type="text"
                        id="name"
                        name="name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium">
                        Email
                      </label>
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium">
                        Message
                      </label>
                      <Field
                        as="textarea"
                        id="message"
                        name="message"
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <ErrorMessage name="message" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </button>
                    </div>
                    {submissionStatus === 'success' && (
                      <div className="text-green-500 text-center">
                        Thank you for your message! We'll be in touch soon.
                      </div>
                    )}
                    {submissionStatus === 'error' && (
                      <div className="text-red-500 text-center">
                        {submissionError}
                      </div>
                    )}
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </section>
    </MinimalLayout>
  );
};

export default ContactPage;