import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import toast from 'react-hot-toast';

import { fetchBatches } from '../../redux/features/batch/batchSlice';
import { fetchTeachers } from '../../redux/features/teacher/teacherSlice';
import { fetchSubjects } from '../../redux/features/subject/subjectSlice';
import api from '../../utils/api';

const AddClassSession = () => {
  const dispatch = useDispatch();

  const { batches = [] } = useSelector((state) => state.batches);
  const { data: teachers = [] } = useSelector((state) => state.teachers);
  const { subjects = [] } = useSelector((state) => state.subjects);

  const [formData, setFormData] = useState({
    batchId: '',
    batchDate: '', // ✅ Added batchDate
    status: 'Active',
    classType: 'Regular',
    sessionMode: 'Online',
    subjectId: '',
    teacherId: '',
    sessionType: 'Single',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    weeklyDays: [],
    repeatEvery: 1,
    onDay: '',
    onThe: '',
    roomNo: '',
    absentNotification: false,
    presentNotification: false,
    createdBy: '',
  });

  useEffect(() => {
    dispatch(fetchBatches());
    dispatch(fetchTeachers());
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const createdBy = loggedInUser?.id;

    if (!createdBy) {
      toast.error("User not found. Please login again.");
      return;
    }

    const scheduleDetails = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      weeklyDays: formData.weeklyDays,
      repeatEvery: formData.repeatEvery,
      onDay: formData.onDay,
      onThe: formData.onThe,
    };

    const payload = {
      ...formData,
      createdBy, // ✅ Set the user's ID here
      scheduleDetails,
    };

    try {
      await api.post('/create-session', payload);
      toast.success('Session created successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Error creating session');
    }
  };


  return (
    <Container className="mt-5">
      <h3 className="mb-4">Create Class Session</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Batch</Form.Label>
          <Form.Select name="batchId" value={formData.batchId} onChange={handleChange} required>
            <option value="">Select Batch</option>
            {batches.map((batch) => (
              <option key={batch._id} value={batch._id}>
                {batch.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* ✅ Batch Date Field */}
        <Form.Group className="mb-3">
          <Form.Label>Batch Date</Form.Label>
          <Form.Control
            type="date"
            name="batchDate"
            value={formData.batchDate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Holidays - Calendar">Holidays - Calendar</option>
                <option value="Holidays - Batch">Holidays - Batch</option>
                <option value="Cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Class Type</Form.Label>
              <Form.Select name="classType" value={formData.classType} onChange={handleChange}>
                <option value="Regular">Regular</option>
                <option value="Exam">Exam</option>
                <option value="Revision">Revision</option>
                <option value="Guest Lecture">Guest Lecture</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Session Mode</Form.Label>
              <Form.Select name="sessionMode" value={formData.sessionMode} onChange={handleChange}>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Session Type</Form.Label>
              <Form.Select name="sessionType" value={formData.sessionType} onChange={handleChange}>
                <option value="Single">Single</option>
                <option value="Every Day">Every Day</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* ✅ Searchable Subject */}
        <Form.Group className="mb-3">
          <Form.Label>Subject</Form.Label>
          <Select
            options={subjects.map((s) => ({ label: s.name, value: s._id }))}
            value={subjects.find((s) => s._id === formData.subjectId)
              ? {
                label: subjects.find((s) => s._id === formData.subjectId).name,
                value: formData.subjectId,
              }
              : null}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, subjectId: selected?.value || '' }))
            }
            placeholder="Select Subject"
            isClearable
          />
        </Form.Group>

        {/* ✅ Searchable Teacher */}
        <Form.Group className="mb-3">
          <Form.Label>Teacher</Form.Label>
          <Select
            options={teachers.map((t) => ({ label: t.name, value: t._id }))}
            value={teachers.find((t) => t._id === formData.teacherId)
              ? {
                label: teachers.find((t) => t._id === formData.teacherId).name,
                value: formData.teacherId,
              }
              : null}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, teacherId: selected?.value || '' }))
            }
            placeholder="Select Teacher"
            isClearable
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        {formData.sessionType === 'Weekly' && (
          <Form.Group className="mb-3">
            <Form.Label>Weekly Days (comma separated)</Form.Label>
            <Form.Control
              type="text"
              name="weeklyDays"
              placeholder="Monday,Wednesday"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  weeklyDays: e.target.value.split(',').map((d) => d.trim()),
                }))
              }
            />
          </Form.Group>
        )}

        {formData.sessionType === 'Monthly' && (
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>On Day (1–31)</Form.Label>
                <Form.Control type="number" name="onDay" value={formData.onDay} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>On The (e.g. First, Second)</Form.Label>
                <Form.Control type="text" name="onThe" value={formData.onThe} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Room No</Form.Label>
          <Form.Control type="text" name="roomNo" value={formData.roomNo} onChange={handleChange} />
        </Form.Group>

        <Form.Check
          type="checkbox"
          label="Absent Notification"
          name="absentNotification"
          checked={formData.absentNotification}
          onChange={handleChange}
          className="mb-2"
        />

        <Form.Check
          type="checkbox"
          label="Present Notification"
          name="presentNotification"
          checked={formData.presentNotification}
          onChange={handleChange}
          className="mb-3"
        />

        <Button type="submit" variant="primary">
          Create Session
        </Button>
      </Form>
    </Container>
  );
};

export default AddClassSession;
