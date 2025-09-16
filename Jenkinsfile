pipeline{
    agent { label 'mac_mini' }

    environment {
        DOCKERHUB_USERNAME = credentials('amarmg04')   // store username in Jenkins
        DOCKERHUB_PASSWORD = credentials('ManAmar*123')   // store password or PAT in Jenkins
        DOCKER_IMAGE = "amarmg04/ci-demo"
    }

    stages{
        stage('Checkout'){
            steps{
                git branch: 'main',
                    url: "https://github.com/AMARMG04/ci-demo.git",
                    credentialsId: 'github-pat'
            }
        }

        stage('Build'){
            steps {
                sh 'npm install'
            }
        }

        stage('Test'){
            steps{
                sh 'npm test -- --ci --detectOpenHandles'
            }
        }

        stage('Docker Build & Push'){
            steps{
                script {
                    // Log in securely using --password-stdin
                    sh """
                        echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
                        docker build -t $DOCKER_IMAGE:${BUILD_NUMBER} .
                        docker push $DOCKER_IMAGE:${BUILD_NUMBER}
                        docker tag $DOCKER_IMAGE:${BUILD_NUMBER} $DOCKER_IMAGE:latest
                        docker push $DOCKER_IMAGE:latest
                    """
                }
            }
        }

        stage('Deploy'){
            steps{
                sh """
                    docker stop ci-demo || true
                    docker rm ci-demo || true
                    docker run -d --name ci-demo -p 3000:3000 $DOCKER_IMAGE:latest
                """
            }
        }
    }

    post{
        always{
            echo 'Pipeline Finished!'
        }
        failure{
            echo 'Build Failed!'
        }
        success{
            echo 'Build Succeeded!'
        }
    }
}
