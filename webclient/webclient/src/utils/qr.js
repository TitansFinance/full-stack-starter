import QRScanner from 'qr-scanner'
QRScanner.WORKER_PATH = '/static/qr-scanner-worker.min.js'
/* https://github.com/nimiq/qr-scanner */

export const QRVideoScanner = (video, onScan = () => ({})) => {
  return new QRScanner(video, result => onScan(result))
}
