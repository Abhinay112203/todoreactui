node {
    environment {
        CI = false          // do not treat warnings as errors
    }
    stage('Build ng image') {
        stage('Pull repository') {
                checkout scm
        }
        stage('Stopping Nginx') {
            sh 'sudo systemctl disable nginx'
        }
        stage('Installing required files') {
            sh 'npm i --save --legacy-peer-deps'
        }
        stage('Building Dist') {
            sh 'npm run build'
        }
        stage('Clear Files') {
            sh 'sudo rm -rf /usr/share/nginx/html/main/*'
        }
        stage('Moving Files') {
            sh ' sudo cp -rf ./build/* /usr/share/nginx/html/main/'
        }
        stage('Starting Nginx') {
            sh 'sudo systemctl enable nginx'
        }
    }
}
