import { toast } from 'sonner';

import { images } from './images';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('upload function', () => {
  let consoleErrorSpy: any;

  beforeEach(() => {
    // eslint-disable-next-line no-restricted-globals
    global.fetch = vi.fn();

    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should upload an image successfully', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        success: true,
        data: {
          id: 'test-id',
          title: 'Test Image',
          url: 'https://example.com/image.jpg',
          width: '100',
          height: '100',
          size: '500KB',
          expiration: '2025-01-01',
          image: {
            filename: 'test-image.jpg',
            name: 'test-image',
            mime: 'image/jpeg',
            extension: 'jpg',
            url: 'https://example.com/test-image.jpg',
          },
          delete_url: 'https://example.com/delete',
        },
      }),
    };

    (fetch as any).mockResolvedValue(mockResponse);

    const file = new File(['file-content'], 'test-image.jpg', { type: 'image/jpeg' });
    const response = await images.upload(file);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.imgbb.com/1/upload'),
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      }),
    );

    expect(response).toEqual({
      success: true,
      data: {
        id: 'test-id',
        title: 'Test Image',
        url: 'https://example.com/image.jpg',
        width: '100',
        height: '100',
        size: '500KB',
        expiration: '2025-01-01',
        image: {
          filename: 'test-image.jpg',
          name: 'test-image',
          mime: 'image/jpeg',
          extension: 'jpg',
          url: 'https://example.com/test-image.jpg',
        },
        delete_url: 'https://example.com/delete',
      },
    });
  });

  it('should handle upload failure', async () => {
    const mockResponse = {
      ok: false,
    };

    (fetch as any).mockResolvedValue(mockResponse);

    const file = new File(['file-content'], 'test-image.jpg', { type: 'image/jpeg' });

    await expect(images.upload(file)).rejects.toThrow('Failed to upload image');

    expect(toast.error).toHaveBeenCalledWith('Failed to upload image');

    expect(consoleErrorSpy).toHaveBeenCalledWith(new Error('Failed to upload image'));
  });

  it('should handle network errors gracefully', async () => {
    (fetch as any).mockRejectedValue(new Error('Network error'));

    const file = new File(['file-content'], 'test-image.jpg', { type: 'image/jpeg' });

    await expect(images.upload(file)).rejects.toThrow('Network error');

    expect(toast.error).toHaveBeenCalledWith('Failed to upload image');

    expect(consoleErrorSpy).toHaveBeenCalledWith(new Error('Network error'));
  });
});
