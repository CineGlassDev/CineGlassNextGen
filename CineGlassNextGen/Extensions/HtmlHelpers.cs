using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace System.Web.Mvc
{
    public static class HtmlHelpers
    {
        public static MvcHtmlString Image(
            this HtmlHelper Helper, 
            string ImageSrc, 
            string ImageAlt,
            object ImageAttributes)
        {
            TagBuilder tagBuilder = new TagBuilder("img");
            tagBuilder.Attributes.Add("src", Helper.Encode(ImageSrc));
            tagBuilder.Attributes.Add("alt", Helper.Encode(ImageAlt));
            tagBuilder.MergeAttributes((IDictionary<string, object>)ImageAttributes, true);
            MvcHtmlString html = new MvcHtmlString(tagBuilder.ToString(TagRenderMode.SelfClosing));
            return html;
        }

        public static MvcHtmlString ImageLink(
            this HtmlHelper Helper, 
            string LinkHref, 
            object LinkAttributes,
            string ImageSrc, 
            string ImageAlt,
            object ImageAttributes)
        {
            TagBuilder imgTag = new TagBuilder("img");
            imgTag.Attributes.Add("src", Helper.Encode(ImageSrc));
            imgTag.Attributes.Add("alt", Helper.Encode(ImageAlt));
            imgTag.MergeAttributes((IDictionary<string, object>)ImageAttributes, true);
            
            TagBuilder linkTag = new TagBuilder("a");
            linkTag.MergeAttribute("href", LinkHref);
            linkTag.InnerHtml = imgTag.ToString(TagRenderMode.SelfClosing);
            linkTag.MergeAttributes((IDictionary<string, string>)LinkAttributes, true);
            MvcHtmlString html = new MvcHtmlString(linkTag.ToString());
            return html;
        }

        public static MvcHtmlString ImageLink(
            this HtmlHelper Helper,
            string ActionName,
            string ControllerName,
            object RouteValues,
            object LinkAttributes,
            string ImageSrc,
            string ImageAlt,
            object ImageAttributes)
        {
            TagBuilder imgTag = new TagBuilder("img");
            imgTag.Attributes.Add("src", Helper.Encode(ImageSrc));
            imgTag.Attributes.Add("alt", Helper.Encode(ImageAlt));
            imgTag.MergeAttributes((IDictionary<string, object>)ImageAttributes, true);

            UrlHelper urlHelper = ((Controller)Helper.ViewContext.Controller).Url;
            var url = urlHelper.Action(ActionName, ControllerName, RouteValues);

            TagBuilder linkTag = new TagBuilder("a");
            linkTag.MergeAttribute("href", url);
            linkTag.InnerHtml = imgTag.ToString(TagRenderMode.SelfClosing);
            linkTag.MergeAttributes((IDictionary<string, object>)LinkAttributes, true);

            MvcHtmlString html = new MvcHtmlString(linkTag.ToString());
            return html;
        }
    }
}