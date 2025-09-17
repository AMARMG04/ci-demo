pipeline{
    agent {label 'mac_mini'}

    environment{
        DOCKERHUB_CREDENTIALS = credentials('dockerhub_creds')
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
         stage('Docker Build & Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub_creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    script {
                        sh '''
                            # Unlock keychain for remote session
                            security unlock-keychain -p "" ~/Library/Keychains/login.keychain-db

                            # Login to Docker
                            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                            # Build and push image
                            docker build -t $DOCKER_IMAGE:${BUILD_NUMBER} .
                            docker push $DOCKER_IMAGE:${BUILD_NUMBER}

                            # Tag as latest and push
                            docker tag $DOCKER_IMAGE:${BUILD_NUMBER} $DOCKER_IMAGE:latest
                            docker push $DOCKER_IMAGE:latest
                        '''
                    }
                }
            }
        }
        stage('Deploy'){
            steps{
                sh '''
                    docker stop ci-demo || true
                    docker rm ci-demo || true
                    docker run -d --name ci-demo -p 3000:3000 $DOCKER_IMAGE:latest
                '''
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
