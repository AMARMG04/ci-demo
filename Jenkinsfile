pipeline{
    agent {label 'mac_mini'}

    environment{
        DOCKERHUB_CREDENTIALS = credentials('dockerhub_creds')
        DOCKER_IMAGE = "amarmg04/ci-demo"
        PATH = "/opt/homebrew/bin:/usr/local/bin:${env.PATH}"
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
                script {
                    // This logs in automatically using Jenkins credential ID 'dockerhub_creds'
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-creds') {
                        def image = docker.build("amarmg04/ci-demo:${BUILD_NUMBER}")
                        image.push()
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
