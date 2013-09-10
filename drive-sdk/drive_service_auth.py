import httplib2
import pprint
import sys

from apiclient.discovery import build
from oauth2client.client import SignedJwtAssertionCredentials
from apiclient import errors

# Email of the Service Account.
SERVICE_ACCOUNT_EMAIL = '687694281089-etb0hi8i166r34tgd3nhlddtb7s8gif5@developer.gserviceaccount.com'

# Path to the Service Account's Private Key file.
SERVICE_ACCOUNT_PKCS12_FILE_PATH = 'f80b2747be7cf4c471e33d0561b035619cf581e0-privatekey.p12'

def createDriveService():
  """Builds and returns a Drive service object authorized with the given service account.

  Returns:
    Drive service object.
  """
  f = file(SERVICE_ACCOUNT_PKCS12_FILE_PATH, 'rb')
  key = f.read()
  f.close()

  credentials = SignedJwtAssertionCredentials(SERVICE_ACCOUNT_EMAIL, key,
      scope='https://www.googleapis.com/auth/drive')
  http = httplib2.Http()
  http = credentials.authorize(http)

  return build('drive', 'v2', http=http)

driveService = createDriveService()

def fileMetaData(fileId=None):
  if fileId:
    f = driveService.files().get(fileId=fileId).execute()
    return f
  else:
    return None

def insertPlainTextFile(contents="This is a test"):
  resource = {
    'title': 'This is a test google drive sdk',
    'description': 'This is a test with google drive sdk',
    'mimeType': 'text/plain'
  }
  r = driveService.files().insert(body=resource).execute()
  return r

def listFiles(q):
  items = driveService.files().list(q=q).execute()['items']
  print len(items), 'results found.'
  return items

def downloadFile(service, drive_file):
  """Download a file's content.

  Args:
    service: Drive API service instance.
    drive_file: Drive File instance.

  Returns:
    File's content if successful, None otherwise.
  """
  download_url = drive_file.get('downloadUrl')
  if download_url:
    resp, content = service._http.request(download_url)
    if resp.status == 200:
      # print 'Status: %s' % resp
      return content
    else:
      print 'An error occurred: %s' % resp
      return None
  else:
    # The file doesn't have any content stored on Drive.
    return None  

def insert_file_into_folder(service, folder_id, file_id):
  """Insert a file into a folder.

  Args:
    service: Drive API service instance.
    folder_id: ID of the folder to insert the file into.
    file_id: ID of the file to insert.
  Returns:
    The inserted child if successful, None otherwise.
  """
  new_child = {'id': file_id}
  try:
    return service.children().insert(
        folderId=folder_id, body=new_child).execute()
  except errors.HttpError, error:
    print 'An error occurred: %s' % error
  return None

def print_files_in_folder(service, folder_id):
  """Print files belonging to a folder.

  Args:
    service: Drive API service instance.
    folder_id: ID of the folder to print files from.
  """
  page_token = None
  while True:
    try:
      param = {}
      if page_token:
        param['pageToken'] = page_token
      children = service.children().list(
          folderId=folder_id, **param).execute()

      for child in children.get('items', []):
        print 'File Id: %s' % child['id']
      page_token = children.get('nextPageToken')
      if not page_token:
        break
    except errors.HttpError, error:
      print 'An error occurred: %s' % error
      break

def insert_permission(service, file_id, value, perm_type, role):
  """Insert a new permission.

  Args:
    service: Drive API service instance.
    file_id: ID of the file to insert permission for.
    value: User or group e-mail address, domain name or None for 'default'
           type.
    perm_type: The value 'user', 'group', 'domain' or 'default'.
    role: The value 'owner', 'writer' or 'reader'.
  Returns:
    The inserted permission if successful, None otherwise.
  """
  new_permission = {
      'value': value,
      'type': perm_type,
      'role': role
  }
  try:
    return service.permissions().insert(
        fileId=file_id, body=new_permission).execute()
  except errors.HttpError, error:
    print 'An error occurred: %s' % error
  return None

def insert_comment(service, file_id, content):
  """Insert a new document-level comment.

  Args:
    service: Drive API service instance.
    file_id: ID of the file to insert comment for.
    content: Text content of the comment.
  Returns:
    The inserted comment if successful, None otherwise.
  """
  new_comment = {
      'content': content
  }
  try:
    return service.comments().insert(
        fileId=file_id, body=new_comment).execute()
  except errors.HttpError, error:
    print 'An error occurred: %s' % error
  return None

'''
f = fileMetaData(fileId="1ssnrfZEjLSNRAQMaIKWbAKPJOj1NmBznORZLlwEtKyA")
print f

i = insertPlainTextFile(contents="This is a test")
print i
'''

'''
list = listFiles("'root' in parents")
for f in list:
  print f['id']
  #d = downloadFile(driveService, f)
  #print d
'''

# p = insert_permission(driveService, "1tWvfE7hqVFZb2BrM_lrx_SiAr8Zqk66eG75Ek2bmPrA", "glavin.wiechert@gmail.com", "user", "owner")

# insert_comment(driveService, "1tWvfE7hqVFZb2BrM_lrx_SiAr8Zqk66eG75Ek2bmPrA", "This is a comment with the Google Drive Bot")


c = insert_file_into_folder(driveService, "0B5-qlJU7RXiNMlN6OGtBWk4wUlE", "1tWvfE7hqVFZb2BrM_lrx_SiAr8Zqk66eG75Ek2bmPrA")
print c