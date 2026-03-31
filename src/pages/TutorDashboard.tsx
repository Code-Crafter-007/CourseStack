import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Category, Course, TutorCourseFormState, TutorCourseInput } from '../types/course';
import { tutorService } from '../services/tutorService';

const initialForm: TutorCourseFormState = {
title: '',
description: '',
category_id: '',
price: '',
thumbnail_url: ''
};

const getStyles = (isDark: boolean): Record<string, React.CSSProperties> => {
const bgMain = isDark ? '#121212' : '#ffffff';
const bgPanel = isDark ? '#1e1e1e' : '#ffffff';
const bgHover = isDark ? '#2c2c2c' : '#f7f9fa';
const textMain = isDark ? '#e0e0e0' : '#1c1d1f';
const textSec = isDark ? '#aaaaaa' : '#6a6f73';
const border = isDark ? '#333333' : '#d1d7dc';
const purple = '#a435f0';

return {
    page: {
        minHeight: '100vh',
        background: bgMain,
        color: textMain,
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        padding: '32px 24px',
        transition: 'background 0.3s, color 0.3s'
    },
    container: {
        maxWidth: '1180px',
        margin: '0 auto'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid ' + border,
        paddingBottom: '24px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
    },
    headerRight: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
    },
    title: {
        fontSize: '32px',
        fontWeight: 700,
        margin: 0,
        fontFamily: "'Suisse Type', serif"
    },
    subtitle: {
        margin: '8px 0 0 0',
        color: textSec,
        fontSize: '16px'
    },
    actionButton: {
        border: '1px solid ' + border,
        background: bgMain,
        color: textMain,
        padding: '10px 16px',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: '14px',
        transition: 'all 0.2s'
    },
    statRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
    },
    statCard: {
        border: '1px solid ' + border,
        padding: '16px',
        background: bgHover
    },
    statLabel: {
        color: textSec,
        fontSize: '14px',
        fontWeight: 700,
        marginBottom: '8px'
    },
    statValue: {
        fontSize: '32px',
        fontWeight: 700,
        color: textMain
    },
    panel: {
        border: '1px solid ' + border,
        padding: '24px',
        background: bgPanel,
        maxWidth: '800px',
        margin: '0 auto'
    },
    panelTitle: {
        marginTop: 0,
        marginBottom: '16px',
        fontSize: '24px',
        fontWeight: 700,
        color: textMain
    },
    fieldLabel: {
        display: 'block',
        fontSize: '14px',
        fontWeight: 700,
        color: textMain,
        marginBottom: '8px',
        marginTop: '16px'
    },
    input: {
        width: '100%',
        border: '1px solid ' + border,
        background: bgMain,
        color: textMain,
        padding: '12px 16px',
        outline: 'none',
        fontSize: '15px',
        boxSizing: 'border-box'
    },
    textarea: {
        width: '100%',
        minHeight: '120px',
        resize: 'vertical',
        border: '1px solid ' + border,
        background: bgMain,
        color: textMain,
        padding: '12px 16px',
        outline: 'none',
        fontSize: '15px',
        boxSizing: 'border-box'
    },
    buttonRow: {
        display: 'flex',
        gap: '8px',
        marginTop: '24px'
    },
    primaryButton: {
        border: 'none',
        background: purple,
        color: '#fff',
        padding: '12px 24px',
        fontWeight: 700,
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background 0.2s'
    },
    secondaryButton: {
        border: '1px solid ' + textMain,
        background: bgMain,
        color: textMain,
        padding: '12px 24px',
        fontWeight: 700,
        cursor: 'pointer',
        fontSize: '16px'
    },
    courseGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px'
    },
    courseCard: {
        border: '1px solid ' + border,
        padding: '16px',
        background: bgPanel,
        display: 'flex',
        flexDirection: 'column'
    },
    courseTitle: {
        margin: '0 0 8px 0',
        fontSize: '18px',
        fontWeight: 700,
        color: textMain
    },
    courseDesc: {
        margin: '0 0 12px 0',
        color: textSec,
        fontSize: '14px',
        lineHeight: 1.4
    },
    courseMeta: {
        margin: '0 0 4px 0',
        color: textSec,
        fontSize: '12px',
        fontWeight: 400
    },
    manageButton: {
        border: 'none',
        background: purple,
        color: '#ffffff',
        padding: '10px 16px',
        cursor: 'pointer',
        fontWeight: 700,
        width: '100%',
        marginBottom: '8px'
    },
    cardActions: {
        display: 'flex',
        gap: '8px',
        marginTop: 'auto',
        paddingTop: '16px',
        flexDirection: 'column'
    },
    editButton: {
        border: '1px solid ' + textMain,
        background: bgPanel,
        color: textMain,
        padding: '8px 16px',
        cursor: 'pointer',
        fontWeight: 700,
        flex: 1
    },
    deleteButton: {
        border: 'none',
        background: isDark ? '#ff4d4f' : '#1c1d1f',
        color: '#ffffff',
        padding: '8px 16px',
        cursor: 'pointer',
        fontWeight: 700,
        flex: 1
    },
    emptyText: {
        color: textSec,
        fontSize: '16px',
        textAlign: 'center',
        padding: '40px 0'
    },
    alertError: {
        marginBottom: '16px',
        background: isDark ? 'rgba(201, 42, 42, 0.15)' : '#fde8e8',
        border: '1px solid ' + (isDark ? 'rgba(201, 42, 42, 0.5)' : '#f98080'),
        color: isDark ? '#ffa8a8' : '#c81e1e',
        padding: '12px',
        fontSize: '14px'
    },
    alertSuccess: {
        marginBottom: '16px',
        background: isDark ? 'rgba(46, 160, 67, 0.18)' : '#def7ec',
        border: '1px solid ' + (isDark ? 'rgba(46, 160, 67, 0.5)' : '#31c48d'),
        color: isDark ? '#b2f2bb' : '#046c4e',
        padding: '12px',
        fontSize: '14px'
    },
    loadingShell: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: bgMain,
        color: textMain,
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    },
    builderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: bgHover,
        border: '1px solid ' + border,
        padding: '16px',
        marginBottom: '24px'
    },
    moduleConfigCard: {
        border: '1px solid ' + border,
        background: bgPanel,
        marginBottom: '16px'
    },
    moduleConfigHeader: {
        background: bgHover,
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 700,
        borderBottom: '1px solid ' + border
    },
    lectureList: {
        padding: '16px'
    },
    lectureRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid ' + border
    },
    smallIconButton: {
        border: '1px solid ' + border,
        background: bgMain,
        color: textMain,
        padding: '6px 8px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 700
    },
    smallDangerButton: {
        border: 'none',
        background: isDark ? '#ff4d4f' : '#1c1d1f',
        color: '#fff',
        padding: '6px 8px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 700
    },
    typeBadge: {
        marginLeft: '10px',
        fontSize: '11px',
        border: '1px solid ' + border,
        padding: '2px 6px',
        borderRadius: '999px',
        color: textSec
    },
    modalOverlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
    },
    modalCard: {
        width: '100%',
        maxWidth: '560px',
        background: bgPanel,
        border: '1px solid ' + border,
        padding: '20px'
    },
    modalTitle: {
        margin: '0 0 12px 0',
        fontSize: '20px',
        fontWeight: 700
    },
    helperText: {
        marginTop: '8px',
        fontSize: '12px',
        color: textSec
    }
};
};

const TutorDashboard: React.FC = () => {
const { currentUser, logout } = useAuth();

const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
const [showForm, setShowForm] = useState<boolean>(false);
const [builderCourseId, setBuilderCourseId] = useState<string | null>(null);

const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);

const [courses, setCourses] = useState<Course[]>([]);
const [categories, setCategories] = useState<Category[]>([]);
const [form, setForm] = useState<TutorCourseFormState>(initialForm);
const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

const [modules, setModules] = useState<any[]>([]);
const [loadingModules, setLoadingModules] = useState<boolean>(false);

const [loading, setLoading] = useState<boolean>(true);
const [saving, setSaving] = useState<boolean>(false);
const [errorMsg, setErrorMsg] = useState<string | null>(null);
const [successMsg, setSuccessMsg] = useState<string | null>(null);

const [lectureModalOpen, setLectureModalOpen] = useState<boolean>(false);
const [lectureTargetModuleId, setLectureTargetModuleId] = useState<string | null>(null);
const [lectureTargetCount, setLectureTargetCount] = useState<number>(0);
const [lectureTitleInput, setLectureTitleInput] = useState<string>('');
const [lectureTypeInput, setLectureTypeInput] = useState<'youtube' | 'upload'>('youtube');
const [lectureUrlInput, setLectureUrlInput] = useState<string>('');
const [lectureFileInput, setLectureFileInput] = useState<File | null>(null);
const [lectureSaving, setLectureSaving] = useState<boolean>(false);

const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.category_id, c.name])),
    [categories]
);

useEffect(() => {
    const run = async () => {
        if (!currentUser?.id) return;
        setLoading(true);
        try {
            const [courseRows, categoryRows] = await Promise.all([
                tutorService.getTutorCourses(currentUser.id),
                tutorService.getCategories()
            ]);
            setCourses(courseRows);
            setCategories(categoryRows);
        } catch (error: any) {
            setErrorMsg(error.message || 'Failed to load tutor dashboard data.');
        } finally {
            setLoading(false);
        }
    };
    run();
}, [currentUser?.id]);

useEffect(() => {
    if (builderCourseId) {
        loadModules(builderCourseId);
    }
}, [builderCourseId]);

const loadModules = async (courseId: string) => {
    setLoadingModules(true);
    try {
        const data = await tutorService.getModulesWithLectures(courseId);
        setModules(data);
    } catch (error: any) {
        setErrorMsg(error.message || 'Failed to load curriculum data.');
    } finally {
        setLoadingModules(false);
    }
};

const onFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
};

const handleCreateClick = () => {
    setForm(initialForm);
    setEditingCourseId(null);
    setBuilderCourseId(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    setShowForm(true);
};

const startEdit = (course: Course) => {
    setEditingCourseId(course.course_id);
    setForm({
        title: course.title || '',
        description: course.description || '',
        category_id: String(course.category_id ?? ''),
        price: String(course.price ?? ''),
        thumbnail_url: course.thumbnail_url || ''
    });
    setErrorMsg(null);
    setSuccessMsg(null);
    setBuilderCourseId(null);
    setShowForm(true);
};

const cancelForm = () => {
    setForm(initialForm);
    setEditingCourseId(null);
    setShowForm(false);
    setErrorMsg(null);
};

const buildPayload = (): TutorCourseInput | null => {
    const categoryIdNumber = Number(form.category_id);
    const priceNumber = Number(form.price);

    if (!form.title.trim()) { setErrorMsg('Course title is required.'); return null; }
    if (!form.description.trim()) { setErrorMsg('Course description is required.'); return null; }
    if (!Number.isFinite(categoryIdNumber) || categoryIdNumber <= 0) { setErrorMsg('Please select a valid category.'); return null; }
    if (!Number.isFinite(priceNumber) || priceNumber < 0) { setErrorMsg('Please enter a valid price.'); return null; }

    return {
        title: form.title.trim(),
        description: form.description.trim(),
        category_id: categoryIdNumber,
        price: priceNumber,
        thumbnail_url: form.thumbnail_url.trim()
    };
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!currentUser?.id) return;
    const payload = buildPayload();
    if (!payload) return;

    setSaving(true);
    try {
        if (editingCourseId) {
            const updated = await tutorService.updateCourse(currentUser.id, editingCourseId, payload);
            setCourses((prev) => prev.map((c) => (c.course_id === editingCourseId ? updated : c)));
            setSuccessMsg('Course updated successfully.');
        } else {
            const created = await tutorService.createCourse(currentUser.id, payload);
            setCourses((prev) => [created, ...prev]);
            setSuccessMsg('Course created successfully.');
        }
        setShowForm(false);
    } catch (error: any) {
        setErrorMsg(error.message || 'Failed to save course.');
    } finally {
        setSaving(false);
    }
};

const handleDelete = async (courseId: string) => {
    if (!currentUser?.id) return;
    if (!window.confirm('Delete this course? This action cannot be undone.')) return;

    try {
        await tutorService.deleteCourse(currentUser.id, courseId);
        setCourses((prev) => prev.filter((c) => c.course_id !== courseId));
        setSuccessMsg('Course deleted successfully.');
    } catch (error: any) {
        setErrorMsg(error.message || 'Failed to delete course.');
    }
};

const openLectureModal = (moduleId: string, currentCount: number) => {
    setLectureTargetModuleId(moduleId);
    setLectureTargetCount(currentCount);
    setLectureTitleInput('');
    setLectureTypeInput('youtube');
    setLectureUrlInput('');
    setLectureFileInput(null);
    setLectureModalOpen(true);
    setErrorMsg(null);
};

const closeLectureModal = () => {
    setLectureModalOpen(false);
    setLectureTargetModuleId(null);
    setLectureTargetCount(0);
    setLectureTitleInput('');
    setLectureTypeInput('youtube');
    setLectureUrlInput('');
    setLectureFileInput(null);
};

const handleAddModule = async () => {
    const title = window.prompt('Enter section title:');
    if (!title || !builderCourseId) return;

    try {
        await tutorService.createModule(builderCourseId, title, modules.length + 1);
        await loadModules(builderCourseId);
        setSuccessMsg('Section added.');
    } catch (error: any) {
        setErrorMsg('Failed to add section: ' + error.message);
    }
};

const handleEditModule = async (moduleId: string, currentTitle: string) => {
    const nextTitle = window.prompt('Edit section title:', currentTitle);
    if (!nextTitle || nextTitle.trim() === currentTitle) return;

    try {
        await tutorService.updateModule(moduleId, { module_title: nextTitle.trim() });
        await loadModules(builderCourseId as string);
        setSuccessMsg('Section updated.');
    } catch (error: any) {
        setErrorMsg('Failed to update section: ' + error.message);
    }
};

const handleMoveModule = async (moduleIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? moduleIndex - 1 : moduleIndex + 1;
    if (targetIndex < 0 || targetIndex >= modules.length) return;

    const current = modules[moduleIndex];
    const target = modules[targetIndex];

    const currentOrder = Number(current.order_number ?? (moduleIndex + 1));
    const targetOrder = Number(target.order_number ?? (targetIndex + 1));

    try {
        await Promise.all([
            tutorService.updateModule(current.module_id, { order_number: targetOrder }),
            tutorService.updateModule(target.module_id, { order_number: currentOrder })
        ]);
        await loadModules(builderCourseId as string);
        setSuccessMsg('Section reordered.');
    } catch (error: any) {
        setErrorMsg('Failed to reorder section: ' + error.message);
    }
};

const handleDeleteModule = async (moduleId: string) => {
    if (!window.confirm('Delete this section and all its lectures?')) return;

    try {
        await tutorService.deleteModule(moduleId);
        await loadModules(builderCourseId as string);
        setSuccessMsg('Section deleted.');
    } catch (error: any) {
        setErrorMsg('Failed to delete section: ' + error.message);
    }
};

const handleSaveLecture = async () => {
    if (!builderCourseId || !lectureTargetModuleId) return;

    if (!lectureTitleInput.trim()) {
        setErrorMsg('Lecture title is required.');
        return;
    }

    setLectureSaving(true);
    setErrorMsg(null);

    try {
        let finalUrl = '';
        let finalType: 'youtube' | 'upload' = lectureTypeInput;

        if (lectureTypeInput === 'upload') {
            if (!lectureFileInput) {
                setErrorMsg('Please choose a video file.');
                setLectureSaving(false);
                return;
            }

            finalUrl = await tutorService.uploadLectureVideo(lectureFileInput, lectureTargetModuleId);
            finalType = 'upload';
        } else {
            if (!lectureUrlInput.trim()) {
                setErrorMsg('Please enter video URL.');
                setLectureSaving(false);
                return;
            }
            finalUrl = lectureUrlInput.trim();
            finalType = 'youtube';
        }

        await tutorService.createLecture(
            lectureTargetModuleId,
            lectureTitleInput.trim(),
            finalUrl,
            finalType,
            lectureTargetCount + 1
        );

        await loadModules(builderCourseId);
        setSuccessMsg('Lecture added successfully.');
        closeLectureModal();
    } catch (error: any) {
        setErrorMsg('Failed to add lecture: ' + error.message);
    } finally {
        setLectureSaving(false);
    }
};

const handleEditLecture = async (lectureId: string, currentTitle: string, currentUrl: string) => {
    const nextTitle = window.prompt('Edit lecture title:', currentTitle);
    if (!nextTitle) return;

    const nextUrl = window.prompt('Edit lecture video URL:', currentUrl);
    if (!nextUrl) return;

    try {
        await tutorService.updateLecture(lectureId, {
            title: nextTitle.trim(),
            video_url: nextUrl.trim()
        });
        await loadModules(builderCourseId as string);
        setSuccessMsg('Lecture updated.');
    } catch (error: any) {
        setErrorMsg('Failed to update lecture: ' + error.message);
    }
};

const handleMoveLecture = async (moduleIndex: number, lectureIndex: number, direction: 'up' | 'down') => {
    const mod = modules[moduleIndex];
    const lectures = mod.lectures || [];
    const targetIndex = direction === 'up' ? lectureIndex - 1 : lectureIndex + 1;

    if (targetIndex < 0 || targetIndex >= lectures.length) return;

    const current = lectures[lectureIndex];
    const target = lectures[targetIndex];

    const currentOrder = Number(current.order_number ?? (lectureIndex + 1));
    const targetOrder = Number(target.order_number ?? (targetIndex + 1));

    try {
        await Promise.all([
            tutorService.updateLecture(current.lecture_id, { order_number: targetOrder }),
            tutorService.updateLecture(target.lecture_id, { order_number: currentOrder })
        ]);
        await loadModules(builderCourseId as string);
        setSuccessMsg('Lecture reordered.');
    } catch (error: any) {
        setErrorMsg('Failed to reorder lecture: ' + error.message);
    }
};

const handleDeleteLecture = async (lectureId: string) => {
    if (!window.confirm('Delete this lecture?')) return;

    try {
        await tutorService.deleteLecture(lectureId);
        await loadModules(builderCourseId as string);
        setSuccessMsg('Lecture deleted.');
    } catch (error: any) {
        setErrorMsg('Failed to delete lecture: ' + error.message);
    }
};

if (loading) return <div style={styles.loadingShell}>Loading tutor dashboard...</div>;

const activeCourseName = courses.find((c) => c.course_id === builderCourseId)?.title;

return (
    <div style={styles.page}>
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Tutor Dashboard</h1>
                    <p style={styles.subtitle}>Welcome back, {currentUser?.name}. Manage your catalog.</p>
                </div>
                <div style={styles.headerRight}>
                    {!showForm && !builderCourseId && (
                        <button onClick={handleCreateClick} style={styles.primaryButton}>
                            Create Course
                        </button>
                    )}
                    <button onClick={() => setIsDarkMode(!isDarkMode)} style={styles.actionButton}>
                        {isDarkMode ? 'Light' : 'Dark'}
                    </button>
                    <button onClick={logout} style={styles.actionButton}>Logout</button>
                </div>
            </div>

            {errorMsg && <div style={styles.alertError}>{errorMsg}</div>}
            {successMsg && <div style={styles.alertSuccess} onClick={() => setSuccessMsg(null)}>{successMsg}</div>}

            {builderCourseId ? (
                <div>
                    <div style={styles.builderHeader}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '20px' }}>Curriculum Builder</h2>
                            <p style={{ margin: '4px 0 0', color: '#6a6f73' }}>
                                Editing: <strong>{activeCourseName}</strong>
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={handleAddModule} style={styles.primaryButton}>Add Section</button>
                            <button onClick={() => setBuilderCourseId(null)} style={styles.secondaryButton}>Back to Courses</button>
                        </div>
                    </div>

                    {loadingModules ? (
                        <div style={{ padding: '40px', textAlign: 'center' }}>Loading curriculum...</div>
                    ) : modules.length === 0 ? (
                        <div style={{ ...styles.panel, textAlign: 'center', padding: '40px' }}>
                            <h3 style={{ margin: '0 0 12px 0' }}>No curriculum available yet.</h3>
                            <p style={{ margin: '0 0 24px 0', color: '#6a6f73' }}>
                                Start by adding your first section and then lectures.
                            </p>
                            <button onClick={handleAddModule} style={styles.primaryButton}>Add First Section</button>
                        </div>
                    ) : (
                        <div>
                            {modules.map((mod, mIndex) => (
                                <div key={mod.module_id} style={styles.moduleConfigCard}>
                                    <div style={styles.moduleConfigHeader}>
                                        <span>Section {mIndex + 1}: {mod.title}</span>
                                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                            <button
                                                onClick={() => handleMoveModule(mIndex, 'up')}
                                                style={{ ...styles.smallIconButton, opacity: mIndex === 0 ? 0.5 : 1 }}
                                                disabled={mIndex === 0}
                                            >
                                                Up
                                            </button>
                                            <button
                                                onClick={() => handleMoveModule(mIndex, 'down')}
                                                style={{ ...styles.smallIconButton, opacity: mIndex === modules.length - 1 ? 0.5 : 1 }}
                                                disabled={mIndex === modules.length - 1}
                                            >
                                                Down
                                            </button>
                                            <button
                                                onClick={() => handleEditModule(mod.module_id, mod.title)}
                                                style={styles.smallIconButton}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => openLectureModal(mod.module_id, mod.lectures?.length || 0)}
                                                style={{ ...styles.actionButton, marginLeft: '8px' }}
                                            >
                                                Add Lecture
                                            </button>
                                            <button
                                                onClick={() => handleDeleteModule(mod.module_id)}
                                                style={styles.smallDangerButton}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    <div style={styles.lectureList}>
                                        {!mod.lectures || mod.lectures.length === 0 ? (
                                            <div style={{ color: '#6a6f73', fontSize: '14px', fontStyle: 'italic' }}>
                                                No lectures in this section yet.
                                            </div>
                                        ) : (
                                            mod.lectures.map((lec: any, lIndex: number) => (
                                                <div key={lec.lecture_id} style={styles.lectureRow}>
                                                    <div>
                                                        <span style={{ marginRight: '16px', fontWeight: 700, color: '#6a6f73' }}>
                                                            Lecture {lIndex + 1}
                                                        </span>
                                                        {lec.title}
                                                        <span style={styles.typeBadge}>
                                                            {lec.lecture_type === 'upload' ? 'Uploaded' : 'YouTube'}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                        <button
                                                            onClick={() => handleMoveLecture(mIndex, lIndex, 'up')}
                                                            style={{ ...styles.smallIconButton, opacity: lIndex === 0 ? 0.5 : 1 }}
                                                            disabled={lIndex === 0}
                                                        >
                                                            Up
                                                        </button>
                                                        <button
                                                            onClick={() => handleMoveLecture(mIndex, lIndex, 'down')}
                                                            style={{
                                                                ...styles.smallIconButton,
                                                                opacity: lIndex === (mod.lectures?.length || 0) - 1 ? 0.5 : 1
                                                            }}
                                                            disabled={lIndex === (mod.lectures?.length || 0) - 1}
                                                        >
                                                            Down
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditLecture(lec.lecture_id, lec.title, lec.video_url)}
                                                            style={styles.smallIconButton}
                                                        >
                                                            Edit
                                                        </button>
                                                        <a
                                                            href={lec.video_url}
                                                            target='_blank'
                                                            rel='noreferrer'
                                                            style={{ ...styles.smallIconButton, textDecoration: 'none' }}
                                                        >
                                                            Open
                                                        </a>
                                                        <button
                                                            onClick={() => handleDeleteLecture(lec.lecture_id)}
                                                            style={styles.smallDangerButton}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : showForm ? (
                <section style={styles.panel}>
                    <h3 style={styles.panelTitle}>{editingCourseId ? 'Edit Course Details' : 'Create a New Course'}</h3>

                    <form onSubmit={handleSubmit}>
                        <label style={styles.fieldLabel}>Course Title</label>
                        <input
                            name='title'
                            placeholder='E.g. Advanced TypeScript Patterns'
                            value={form.title}
                            onChange={onFormChange}
                            style={styles.input}
                        />

                        <label style={styles.fieldLabel}>Description</label>
                        <textarea
                            name='description'
                            placeholder='What will students learn?'
                            value={form.description}
                            onChange={onFormChange}
                            style={styles.textarea}
                        />

                        <label style={styles.fieldLabel}>Category</label>
                        <select name='category_id' value={form.category_id} onChange={onFormChange} style={styles.input}>
                            <option value=''>Select category...</option>
                            {categories.map((cat) => (
                                <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                            ))}
                        </select>

                        <label style={styles.fieldLabel}>Price (INR)</label>
                        <input
                            name='price'
                            type='number'
                            placeholder='E.g. 499'
                            value={form.price}
                            onChange={onFormChange}
                            style={styles.input}
                        />

                        <label style={styles.fieldLabel}>Thumbnail URL</label>
                        <input
                            name='thumbnail_url'
                            placeholder='https://example.com/image.jpg'
                            value={form.thumbnail_url}
                            onChange={onFormChange}
                            style={styles.input}
                        />

                        <div style={styles.buttonRow}>
                            <button
                                type='submit'
                                disabled={saving}
                                style={{ ...styles.primaryButton, ...(saving ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}
                            >
                                {saving ? 'Saving...' : editingCourseId ? 'Update Detail' : 'Publish Initial Course'}
                            </button>
                            <button type='button' onClick={cancelForm} style={styles.secondaryButton}>Cancel</button>
                        </div>
                    </form>
                </section>
            ) : (
                <>
                    <div style={styles.statRow}>
                        <div style={styles.statCard}>
                            <div style={styles.statLabel}>Total Courses Owned</div>
                            <div style={styles.statValue}>{courses.length}</div>
                        </div>
                    </div>

                    <div style={styles.courseGrid}>
                        {courses.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', ...styles.emptyText }}>
                                No courses created yet. Click Create Course to get started.
                            </div>
                        ) : (
                            courses.map((course) => (
                                <article key={course.course_id} style={styles.courseCard}>
                                    <div>
                                        <h4 style={styles.courseTitle}>{course.title}</h4>
                                        <p style={styles.courseDesc}>
                                            {course.description && course.description.length > 80
                                                ? course.description.substring(0, 80) + '...'
                                                : course.description || 'No description provided.'}
                                        </p>
                                        <p style={styles.courseMeta}>
                                            <strong>Category:</strong> {course.Categories?.name || categoryMap.get(course.category_id) || 'Unknown'}
                                        </p>
                                        <p style={styles.courseMeta}>
                                            <strong>Price:</strong> INR {course.price}
                                        </p>
                                    </div>
                                    <div style={styles.cardActions}>
                                        <button onClick={() => setBuilderCourseId(course.course_id)} style={styles.manageButton}>
                                            Manage Curriculum
                                        </button>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => startEdit(course)} style={styles.editButton}>Edit Info</button>
                                            <button onClick={() => handleDelete(course.course_id)} style={styles.deleteButton}>Delete</button>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>

        {lectureModalOpen && (
            <div style={styles.modalOverlay}>
                <div style={styles.modalCard}>
                    <h3 style={styles.modalTitle}>Add Lecture</h3>

                    <label style={styles.fieldLabel}>Lecture Title</label>
                    <input
                        value={lectureTitleInput}
                        onChange={(e) => setLectureTitleInput(e.target.value)}
                        style={styles.input}
                        placeholder='E.g. Introduction'
                    />

                    <label style={styles.fieldLabel}>Video Type</label>
                    <select
                        value={lectureTypeInput}
                        onChange={(e) => setLectureTypeInput(e.target.value as 'youtube' | 'upload')}
                        style={styles.input}
                    >
                        <option value='youtube'>YouTube URL</option>
                        <option value='upload'>Upload Video File</option>
                    </select>

                    {lectureTypeInput === 'youtube' ? (
                        <>
                            <label style={styles.fieldLabel}>YouTube or Public Video URL</label>
                            <input
                                value={lectureUrlInput}
                                onChange={(e) => setLectureUrlInput(e.target.value)}
                                style={styles.input}
                                placeholder='https://...'
                            />
                        </>
                    ) : (
                        <>
                            <label style={styles.fieldLabel}>Choose Video File</label>
                            <input
                                type='file'
                                accept='video/*'
                                onChange={(e) => setLectureFileInput(e.target.files?.[0] || null)}
                                style={styles.input}
                            />
                            <div style={styles.helperText}>
                                This uploads to Supabase Storage bucket named lecture-videos.
                            </div>
                        </>
                    )}

                    <div style={styles.buttonRow}>
                        <button
                            onClick={handleSaveLecture}
                            disabled={lectureSaving}
                            style={{ ...styles.primaryButton, ...(lectureSaving ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}
                        >
                            {lectureSaving ? 'Saving...' : 'Save Lecture'}
                        </button>
                        <button onClick={closeLectureModal} style={styles.secondaryButton}>Cancel</button>
                    </div>
                </div>
            </div>
        )}
    </div>
);
};

export default TutorDashboard;