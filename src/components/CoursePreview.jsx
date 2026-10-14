import { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import { API_BASE_URL } from '../.config';

function CoursePreview({
  checkoutCourses = [],
  onAddToCheckout,
  onRemoveFromCheckout
}) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/courses`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not load courses.');
        }
        return res.json();
      })
      .then((data) => {
        setCourses(data);
      })
      .catch((err) => {
        console.error('Error fetching courses:', err);
        setError('Unable to load courses. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getCourseId = (course) => course._id ?? course.id;

  if (loading) {
    return <div className="courses-preview">Loading courses...</div>;
  }

  if (error) {
    return <div className="courses-preview">{error}</div>;
  }

  return (
    <section className="courses-preview">
      <div className="section-heading">
        <p className="eyebrow">EXPLORE</p>
        <h2>Available Courses</h2>
        <p>Explore courses available for the upcoming semester.</p>
      </div>

      <div className="course-preview-layout">
        <div className="course-grid">
          {courses.map((course) => {
            const courseId = getCourseId(course);

            const isInCheckout = checkoutCourses.some(
              (item) => getCourseId(item) === courseId
            );

            return (
              <CourseCard
                key={courseId}
                number={course.courseNumber ?? course.number}
                title={course.courseName ?? course.name}
                dept={course.subjectArea ?? course.subject}
                credits={String(course.credits ?? 0)}
                description={course.description}
                isInCheckout={isInCheckout}
                onAddToCheckout={() => onAddToCheckout?.(course)}
              />
            );
          })}
        </div>

        <aside className="checkout-sidebar">
          <div className="checkout-header">
            <h2>My Checkout</h2>
            <span className="checkout-count">
              {checkoutCourses.length}
            </span>
          </div>

          {checkoutCourses.length === 0 ? (
            <p className="empty-checkout">
              No courses selected yet. Expand a course card and click
              Add to Checkout to get started.
            </p>
          ) : (
            <div className="checkout-list">
              {checkoutCourses.map((course) => (
                <div
                  className="checkout-item"
                  key={getCourseId(course)}
                >
                  <div className="checkout-item-info">
                    <span className="course-number">
                      {course.courseNumber ?? course.number}
                    </span>
                    <h3>{course.courseName ?? course.name}</h3>
                    <p>{course.credits} Credits</p>
                  </div>

                  <button
                    type="button"
                    className="checkout-remove-btn"
                    onClick={() =>
                      onRemoveFromCheckout?.(getCourseId(course))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="checkout-footer">
            <p>
              Total selected: {checkoutCourses.length}{' '}
              {checkoutCourses.length === 1 ? 'course' : 'courses'}
            </p>

            <button
              type="button"
              className="checkout-submit-btn"
              disabled={checkoutCourses.length === 0}
              onClick={() =>
                alert('Database enrollment is not connected yet.')
              }
            >
              Submit Enrollment
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default CoursePreview;
