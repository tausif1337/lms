from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Category, Course, Lesson, Material, Enrollment, QuestionAnswer
from .serializers import (
    CategorySerializer, CourseSerializer, LessonSerializer, MaterialSerializer,
    EnrollmentSerializer, QuestionAnswerSerializer
)
from drf_yasg.utils import swagger_auto_schema

from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

@swagger_auto_schema(method='post', request_body=CategorySerializer)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])  # Optional: restrict all, then manually handle roles
def category_list_create(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if request.user.role != 'admin':
            return Response({"detail": "Only admin can create categories."}, status=403)

        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@swagger_auto_schema(method='post', request_body=CourseSerializer)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def course_list_create(request):
    if request.method == 'GET':
        if request.user.role == 'admin':
            courses = Course.objects.all()
        elif request.user.role == 'teacher':
            courses = Course.objects.filter(teacher=request.user)
        elif request.user.role == 'student':
            courses = Course.objects.all()  # or add filter for enrolled courses
        else:
            return Response({'detail': 'Unauthorized role'}, status=403)
        
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if request.user.role != 'teacher':
            return Response({'detail': 'Only teachers can create courses.'}, status=403)
        
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(teacher=request.user)  # assuming you have a teacher FK in model
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(method='put', request_body=CourseSerializer)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def course_detail(request, pk):
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response({'detail': 'Course not found'}, status=404)

    if request.method == 'GET':
        if request.user.role == 'admin' or request.user == course.instructor_id:
            serializer = CourseSerializer(course)
            return Response(serializer.data)
        return Response({'detail': 'Permission denied'}, status=403)

    elif request.method == 'PUT':
        if request.user.role != 'teacher' or request.user != course.instructor_id:
            return Response({'detail': 'Only the course owner (teacher) can update this course.'}, status=403)
        
        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save(teacher=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if request.user.role != 'teacher' or request.user != course.instructor_id:
            return Response({'detail': 'Only the course owner (teacher) can delete this course.'}, status=403)
        course.delete()
        return Response({'detail': 'Course deleted'}, status=status.HTTP_204_NO_CONTENT)

@swagger_auto_schema(method='post', request_body=LessonSerializer)
@api_view(['GET', 'POST'])
def lesson_list_create(request):
    if request.method == 'GET':
        lessons = Lesson.objects.all()
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = LessonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='post', request_body=MaterialSerializer)
@api_view(['GET', 'POST'])
def material_list_create(request):
    if request.method == 'GET':
        materials = Material.objects.all()
        serializer = MaterialSerializer(materials, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = MaterialSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='post', request_body=EnrollmentSerializer)
@api_view(['GET', 'POST'])
def enrollment_list_create(request):
    if request.method == 'GET':
        enrollments = Enrollment.objects.all()
        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = EnrollmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(method='post', request_body=QuestionAnswerSerializer)
@api_view(['GET', 'POST'])
def questionanswer_list_create(request):
    if request.method == 'GET':
        questions = QuestionAnswer.objects.all()
        serializer = QuestionAnswerSerializer(questions, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = QuestionAnswerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)