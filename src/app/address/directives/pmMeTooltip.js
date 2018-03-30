/* @ngInject */
function pmMeTooltip(AppModel, pmMeModel, gettextCatalog, tooltipModel) {
    const I18N = {
        getTitle() {
            return gettextCatalog.getString('This will add the {{email}} address to your account', { email: pmMeModel.email() }, 'Info');
        }
    };

    return {
        restrict: 'A',
        link(scope, el) {
            if (!AppModel.is('mobile')) {
                tooltipModel.add(el, { title: I18N.getTitle() });
            }
        }
    };
}
export default pmMeTooltip;
