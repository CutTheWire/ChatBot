import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadIcon from '@mui/icons-material/FileUpload';

function DriveManager() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [characterInfo, setCharacterInfo] = useState({}); // 이미지ID별 캐릭터 정보

  useEffect(() => {
    loadFiles();
    // eslint-disable-next-line
  }, []);

  // 파일 목록 불러오고, 각 파일의 이미지ID로 캐릭터 정보도 불러오기
  const loadFiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin-token');
      const response = await axios.get('/api/drive/files', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFiles(response.data);
      setError(null);

      // 각 파일의 이미지ID로 캐릭터 정보 조회
      const info = {};
      await Promise.all(
        response.data.map(async (file) => {
          const match = file.googleusercontentLink
            ? file.googleusercontentLink.match(/\/d\/([^/?]+)/)
            : null;
          const imageId = match ? match[1] : null;
          if (imageId) {
            try {
              // 캐릭터 정보 API도 토큰 필요하다면 아래처럼 추가
              const res = await axios.get(`/api/characters/by-image/${imageId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              info[imageId] = Array.isArray(res.data) ? res.data[0] : res.data;
            } catch (e) {
              info[imageId] = null;
            }
          }
        })
      );
      setCharacterInfo(info);
    } catch (err) {
      setError('파일 목록을 불러오는데 실패했습니다.');
      console.error('파일 목록 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('파일을 선택해주세요.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('admin-token');
      const formData = new FormData();
      formData.append('file', selectedFile);

      await axios.post('/api/drive/upload', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage('파일이 성공적으로 업로드되었습니다.');
      setSelectedFile(null);
      loadFiles();
    } catch (err) {
      setError('파일 업로드에 실패했습니다.');
      console.error('업로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('정말 이 파일을 삭제하시겠습니까?')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('admin-token');
      await axios.delete(`/api/drive/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage('파일이 성공적으로 삭제되었습니다.');
      loadFiles();
    } catch (err) {
      setError('파일 삭제에 실패했습니다.');
      console.error('삭제 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        구글 드라이브 파일 관리
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <input
          type="file"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          id="file-input"
        />
        <label htmlFor="file-input">
          <Button
            variant="contained"
            component="span"
            startIcon={<FileUploadIcon />}
          >
            파일 선택
          </Button>
        </label>
        {selectedFile && (
          <Box sx={{ mt: 1 }}>
            <Typography>
              선택된 파일: {selectedFile.name}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={loading}
              sx={{ mt: 1 }}
            >
              업로드
            </Button>
          </Box>
        )}
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>사진</TableCell>
                <TableCell>캐릭터명</TableCell>
                <TableCell>파일명</TableCell>
                <TableCell>생성자</TableCell>
                <TableCell>생성일</TableCell>
                <TableCell>미리보기</TableCell>
                <TableCell>작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => {
                const match = file.googleusercontentLink
                  ? file.googleusercontentLink.match(/\/d\/([^/?]+)/)
                  : null;
                const imageId = match ? match[1] : null;
                const character = imageId ? characterInfo[imageId] : null;
                return (
                  <TableRow key={file.id}>
                    {/* 사진(작게) */}
                    <TableCell>
                      <img
                        src={file.thumbnailLink || file.googleusercontentLink || file.webViewLink}
                        alt={file.name}
                        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }}
                        referrerPolicy="no-referrer"
                      />
                    </TableCell>
                    {/* 캐릭터명 */}
                    <TableCell>
                      {character ? character.character_name : <span style={{ color: '#888' }}>-</span>}
                    </TableCell>
                    {/* 파일명 */}
                    <TableCell>{file.name}</TableCell>
                    {/* 생성자 */}
                    <TableCell>
                      {character ? character.userid : <span style={{ color: '#888' }}>-</span>}
                    </TableCell>
                    {/* 생성일 */}
                    <TableCell>
                      {new Date(file.createdTime).toLocaleString()}
                    </TableCell>
                    {/* 미리보기 */}
                    <TableCell>
                      <a
                        href={file.googleusercontentLink || file.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        보기
                      </a>
                    </TableCell>
                    {/* 작업 */}
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(file.id)}
                      >
                        삭제
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default DriveManager;