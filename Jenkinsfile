pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'discord-clone'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Type Check') {
            steps {
                sh 'npm run type-check'
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'npm run test:unit'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        stage('Deploy to Development') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    // Deploy to development environment
                    sh """
                        docker-compose -f docker-compose.development.yml down
                        docker-compose -f docker-compose.development.yml up -d
                    """
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Add production deployment steps here
                    echo 'Deploying to production...'
                }
            }
        }
    }

    post {
        always {
            // Clean up workspace
            cleanWs()
        }
        success {
            // Notify on success
            echo 'Build and deployment successful!'
        }
        failure {
            // Notify on failure
            echo 'Build or deployment failed!'
        }
    }
} 