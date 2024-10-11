node {
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
            sh 'CI=false npm run build'
        }
        stage('Clear Files') {
            sh 'sudo rm -rf /var/www/html/abhinayresume.online/*'
        }
        stage('Moving Files') {
            sh ' sudo cp -rf ./build/* /var/www/html/abhinayresume.online/'
        }
        stage('Starting Nginx') {
            sh 'sudo systemctl enable nginx'
        }
    }
}
