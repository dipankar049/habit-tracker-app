export const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'green' }}
    />
  ),
};
